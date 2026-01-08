import subprocess
import sys
import os

def cut_clip(input_video, start_time, duration, output_name):
    """FFmpeg를 사용하여 영상을 9:16 비율로 크롭하고 자릅니다."""
    print(f"Cutting clip: {output_name} from {start_time} for {duration}s")
    
    # 9:16 크롭 필터 (중앙 기준)
    # 16:9 원본인 경우 가로 1920 -> 세로 1080 -> 9:16을 위해 가로를 607.5 정도로 줄여야 함
    # 간단하게 'crop=ih*9/16:ih' 사용 (세로 길이에 맞춰 가로를 9:16으로 크롭)
    vf_filter = "crop=ih*9/16:ih"
    
    cmd = [
        'ffmpeg', '-y',
        '-ss', str(start_time),
        '-t', str(duration),
        '-i', input_video,
        '-vf', vf_filter,
        '-c:v', 'libx264', '-crf', '23',
        '-c:a', 'aac', '-b:a', '128k',
        output_name
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"Success: {output_name}")
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python cut_shorts.py <input> <start_time> <duration> <output>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    start = sys.argv[2]
    dur = sys.argv[3]
    out = sys.argv[4]
    
    cut_clip(input_file, start, dur, out)
