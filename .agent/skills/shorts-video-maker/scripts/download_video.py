import yt_dlp
import sys
import os

try:
    sys.stdout.reconfigure(line_buffering=True)
except AttributeError:
    pass


def progress_hook(d):
    if d['status'] == 'downloading':
        percent = d.get('_percent_str', '?%').strip()
        speed = d.get('_speed_str', '?').strip()
        eta = d.get('_eta_str', '?').strip()
        downloaded = d.get('_downloaded_bytes_str', '?')
        total = d.get('_total_bytes_str', d.get('_total_bytes_estimate_str', '?'))
        
        print(f"\r[{percent}] {downloaded}/{total} | {speed} | ETA: {eta}    ", end='', flush=True)
    
    elif d['status'] == 'finished':
        filename = d.get('filename', 'video')
        print(f"\nDownload complete, processing... ({filename})", flush=True)
    
    elif d['status'] == 'error':
        print(f"\nDownload error", flush=True)


def download_youtube_video(url, output_path='outputs/temp_video.mp4', max_height=720):
    print(f"Starting download: {url}", flush=True)
    print(f"Output: {output_path}", flush=True)
    print(f"Max resolution: {max_height}p", flush=True)
    print("-" * 50, flush=True)
    
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}", flush=True)
    
    ydl_opts = {
        'format': f'bestvideo[height<={max_height}][ext=mp4]+bestaudio[ext=m4a]/best[height<={max_height}]/best',
        'outtmpl': output_path,
        'quiet': False,
        'no_warnings': False,
        'progress_hooks': [progress_hook],
        'concurrent_fragment_downloads': 4,
        'retries': 3,
        'fragment_retries': 3,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            title = info.get('title', 'Unknown')
            duration = info.get('duration') or 0
            print(f"Title: {title}", flush=True)
            print(f"Duration: {duration // 60}m {duration % 60}s", flush=True)
            print("-" * 50, flush=True)
            
            ydl.download([url])
        
        print(f"\n{'=' * 50}", flush=True)
        print(f"Completed: {output_path}", flush=True)
        
        if os.path.exists(output_path):
            size_mb = os.path.getsize(output_path) / (1024 * 1024)
            print(f"File size: {size_mb:.1f} MB", flush=True)
        
        return output_path
    except Exception as e:
        print(f"\nError: {e}", flush=True)
        return None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python download_video.py <URL> [output_path] [max_height]")
        print("  Example: python download_video.py https://youtube.com/watch?v=xxx")
        print("  Example: python download_video.py https://youtube.com/watch?v=xxx outputs/my_video.mp4 1080")
        sys.exit(1)
    
    video_url = sys.argv[1]
    out_path = sys.argv[2] if len(sys.argv) > 2 else 'outputs/temp_video.mp4'
    height = int(sys.argv[3]) if len(sys.argv) > 3 else 720
    
    download_youtube_video(video_url, output_path=out_path, max_height=height)
