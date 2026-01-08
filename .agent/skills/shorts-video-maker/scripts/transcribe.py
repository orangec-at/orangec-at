import whisper
import sys
import json
import os

def transcribe_video(video_path, output_json='outputs/transcript.json'):
    """Whisper를 사용하여 영상의 자막과 타임스탬프를 추출합니다."""
    if not os.path.exists(video_path):
        print(f"Error: Video file {video_path} not found.")
        return None

    print(f"Transcribing {video_path} using Whisper...")
    
    # 모델 로드 (base 또는 small 추천)
    model = whisper.load_model("base")
    result = model.transcribe(video_path, verbose=False)
    
    # 결과 저장
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        
    print(f"Transcription saved to {output_json}")
    return result

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else 'outputs/temp_video.mp4'
    transcribe_video(path)
