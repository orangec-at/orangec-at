import yt_dlp
import sys
import os

def download_youtube_video(url, output_path='outputs/temp_video.mp4'):
    """YouTube 영상을 최고 화질로 다운로드합니다."""
    print(f"Downloading video from {url}...")
    
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': output_path,
        'quiet': False,
        'no_warnings': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print(f"Download complete: {output_path}")
        return output_path
    except Exception as e:
        print(f"Error downloading video: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python download_video.py <URL>")
        sys.exit(1)
        
    video_url = sys.argv[1]
    download_youtube_video(video_url)
