sleep 1

xset s noblank
xset s off
xset -dpms
unclutter -idle -roo &

ffplay -hide_banner -loglevel error -f v4l2 -framerate 24 -input_format mjpeg -video_size hd720 /dev/video0

DISPLAY=:0 xdotool search --onlyvisible --name "/dev/video0" windowsize 100% 100% && xrandr --output HDMI-1 --auto

