#!/usr/bin/env python3
"""
Text-Based Shorts Video Creator

이미지들을 슬라이드쇼 형태의 쇼츠 영상으로 변환합니다.
- 9:16 세로 형식
- 전환 효과 (fade, slide)
- BGM 및 자막 추가 지원
"""

import argparse
import subprocess
import os
import glob
from pathlib import Path


def get_image_files(input_dir: str) -> list:
    """이미지 파일 목록을 정렬된 순서로 반환"""
    extensions = ['*.png', '*.jpg', '*.jpeg', '*.webp']
    files = []
    for ext in extensions:
        files.extend(glob.glob(os.path.join(input_dir, ext)))
    return sorted(files)


def create_concat_file(image_files: list, duration: float, temp_dir: str) -> str:
    """ffmpeg concat demuxer용 파일 생성"""
    concat_path = os.path.join(temp_dir, 'concat.txt')
    with open(concat_path, 'w') as f:
        for img in image_files:
            # 절대 경로로 변환
            abs_path = os.path.abspath(img)
            f.write(f"file '{abs_path}'\n")
            f.write(f"duration {duration}\n")
        # 마지막 이미지는 한 번 더 (ffmpeg concat 특성)
        if image_files:
            f.write(f"file '{os.path.abspath(image_files[-1])}'\n")
    return concat_path


def create_video_simple(
    input_dir: str,
    output_path: str,
    duration: float = 5.0,
    fps: int = 24
) -> bool:
    """간단한 슬라이드쇼 영상 생성 (전환 효과 없음)"""
    image_files = get_image_files(input_dir)
    
    if not image_files:
        print(f"Error: No image files found in {input_dir}")
        return False
    
    print(f"Found {len(image_files)} images")
    
    # 출력 디렉토리 생성
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
    
    # 임시 디렉토리
    temp_dir = os.path.join(os.path.dirname(output_path) or '.', '.temp_video')
    os.makedirs(temp_dir, exist_ok=True)
    
    # concat 파일 생성
    concat_file = create_concat_file(image_files, duration, temp_dir)
    
    # ffmpeg 명령어
    cmd = [
        'ffmpeg', '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concat_file,
        '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', str(fps),
        output_path
    ]
    
    print(f"Creating video: {output_path}")
    print(f"Duration per slide: {duration}s")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"ffmpeg error: {result.stderr}")
            return False
        print(f"✅ Video created: {output_path}")
        return True
    finally:
        # 임시 파일 정리
        if os.path.exists(concat_file):
            os.remove(concat_file)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)


def create_video_with_fade(
    input_dir: str,
    output_path: str,
    duration: float = 5.0,
    fade_duration: float = 0.5,
    fps: int = 24
) -> bool:
    """Fade 전환 효과가 있는 슬라이드쇼 영상 생성"""
    image_files = get_image_files(input_dir)
    
    if not image_files:
        print(f"Error: No image files found in {input_dir}")
        return False
    
    print(f"Found {len(image_files)} images, applying fade transitions")
    
    # 출력 디렉토리 생성
    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
    
    # 복잡한 필터 그래프 생성
    filter_parts = []
    
    # 각 이미지에 대한 입력 설정
    inputs = []
    for i, img in enumerate(image_files):
        inputs.extend(['-loop', '1', '-t', str(duration), '-i', img])
        # scale + fade in/out
        fade_in = fade_duration if i > 0 else 0
        fade_out_start = duration - fade_duration
        filter_parts.append(
            f"[{i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,"
            f"pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,"
            f"fade=t=in:st=0:d={fade_in},"
            f"fade=t=out:st={fade_out_start}:d={fade_duration}[v{i}]"
        )
    
    # 모든 비디오 연결
    concat_inputs = ''.join([f'[v{i}]' for i in range(len(image_files))])
    filter_parts.append(f"{concat_inputs}concat=n={len(image_files)}:v=1:a=0[outv]")
    
    filter_complex = ';'.join(filter_parts)
    
    cmd = [
        'ffmpeg', '-y',
        *inputs,
        '-filter_complex', filter_complex,
        '-map', '[outv]',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', str(fps),
        output_path
    ]
    
    print(f"Creating video with fade: {output_path}")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"ffmpeg error: {result.stderr}")
            # 페이드 실패 시 간단한 버전으로 폴백
            print("Falling back to simple mode...")
            return create_video_simple(input_dir, output_path, duration, fps)
        print(f"✅ Video created with fade: {output_path}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False


def add_audio(video_path: str, audio_path: str, output_path: str) -> bool:
    """영상에 오디오(BGM) 추가"""
    if not os.path.exists(audio_path):
        print(f"Audio file not found: {audio_path}")
        return False
    
    cmd = [
        'ffmpeg', '-y',
        '-i', video_path,
        '-i', audio_path,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-shortest',  # 영상 길이에 맞춤
        output_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error adding audio: {result.stderr}")
        return False
    
    print(f"✅ Audio added: {output_path}")
    return True


def add_subtitles(video_path: str, subtitle_path: str, output_path: str) -> bool:
    """영상에 자막 추가"""
    if not os.path.exists(subtitle_path):
        print(f"Subtitle file not found: {subtitle_path}")
        return False
    
    cmd = [
        'ffmpeg', '-y',
        '-i', video_path,
        '-vf', f"subtitles={subtitle_path}:force_style='FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2'",
        '-c:a', 'copy',
        output_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error adding subtitles: {result.stderr}")
        return False
    
    print(f"✅ Subtitles added: {output_path}")
    return True


def main():
    parser = argparse.ArgumentParser(
        description='Create shorts video from images'
    )
    parser.add_argument(
        '--input-dir', '-i',
        required=True,
        help='Directory containing slide images'
    )
    parser.add_argument(
        '--output', '-o',
        required=True,
        help='Output video file path'
    )
    parser.add_argument(
        '--duration', '-d',
        type=float,
        default=5.0,
        help='Duration per slide in seconds (default: 5.0)'
    )
    parser.add_argument(
        '--transition', '-t',
        choices=['none', 'fade', 'slide'],
        default='fade',
        help='Transition effect (default: fade)'
    )
    parser.add_argument(
        '--audio', '-a',
        help='Background music file path (optional)'
    )
    parser.add_argument(
        '--subtitle', '-s',
        help='Subtitle file path (.srt) (optional)'
    )
    parser.add_argument(
        '--fps',
        type=int,
        default=24,
        help='Frames per second (default: 24)'
    )
    
    args = parser.parse_args()
    
    # 1. 기본 영상 생성
    if args.transition == 'fade':
        success = create_video_with_fade(
            args.input_dir,
            args.output,
            args.duration,
            fps=args.fps
        )
    else:
        success = create_video_simple(
            args.input_dir,
            args.output,
            args.duration,
            fps=args.fps
        )
    
    if not success:
        print("Failed to create base video")
        return 1
    
    current_output = args.output
    
    # 2. 오디오 추가 (있는 경우)
    if args.audio:
        audio_output = args.output.replace('.mp4', '_audio.mp4')
        if add_audio(current_output, args.audio, audio_output):
            current_output = audio_output
    
    # 3. 자막 추가 (있는 경우)
    if args.subtitle:
        subtitle_output = args.output.replace('.mp4', '_sub.mp4')
        if add_subtitles(current_output, args.subtitle, subtitle_output):
            current_output = subtitle_output
    
    # 최종 파일이 원래 출력과 다르면 이동
    if current_output != args.output:
        os.replace(current_output, args.output)
        print(f"✅ Final video: {args.output}")
    
    # 영상 정보 출력
    probe_cmd = ['ffprobe', '-v', 'quiet', '-show_format', '-print_format', 'json', args.output]
    result = subprocess.run(probe_cmd, capture_output=True, text=True)
    if result.returncode == 0:
        import json
        info = json.loads(result.stdout)
        duration = float(info['format'].get('duration', 0))
        size_mb = int(info['format'].get('size', 0)) / (1024 * 1024)
        print(f"📊 Duration: {duration:.1f}s, Size: {size_mb:.2f}MB")
    
    return 0


if __name__ == '__main__':
    exit(main())
