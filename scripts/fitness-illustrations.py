"""Generate original schematic exercise illustrations and a continuously looping GIF."""
from pathlib import Path
from math import cos, pi
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / 'public/images/fitness'
OUT.mkdir(parents=True, exist_ok=True)
BG, INK, GREEN, LIGHT = '#f6f3eb', '#243c36', '#377d67', '#d9e4d9'
FONT = 'C:/Windows/Fonts/arial.ttf'
def font(size): return ImageFont.truetype(FONT, size)
def canvas(height=560):
    im = Image.new('RGB', (1000, height), BG)
    return im, ImageDraw.Draw(im)
def text(d, xy, value, size=24, color=INK): d.text(xy, value, font=font(size), fill=color)
def body(d, points, head):
    d.line(points, fill=GREEN, width=12, joint='curve')
    x,y=head
    d.ellipse((x-19,y-19,x+19,y+19), fill=INK)
def squat(t):
    im,d=canvas()
    text(d,(45,25),'CHAIR SQUAT',36)
    text(d,(45,78),'Lower with control. Keep feet planted.',25)
    d.line([(180,465),(820,465)], fill=LIGHT, width=5)
    d.line([(355,450),(355,350),(465,350),(465,450)],fill=INK,width=8)
    d.line([(355,350),(355,250)],fill=INK,width=8)
    hip=(520-95*t,300+38*t); knee=(525+38*t,378); foot=(520,458)
    shoulder=(520+5*t,208+75*t); head=(shoulder[0]+3,shoulder[1]-42)
    body(d,[foot,knee,hip,shoulder],head)
    d.line([shoulder,(610,shoulder[1]+12),(657,shoulder[1]+12)],fill=GREEN,width=10)
    d.line([(500,460),(555,460)],fill=INK,width=10)
    text(d,(700,300),'Sit back' if t>.4 else 'Stand tall',22)
    text(d,(45,505),'SCHEMATIC • Use a stable chair against a wall.',20)
    return im

squat(1).save(OUT/'chair-squat.png')
frames=[squat((1-cos(2*pi*i/36))/2) for i in range(36)]
frames[0].save(OUT/'chair-squat-loop.gif', save_all=True, append_images=frames[1:], duration=100, loop=0, optimize=True)

im,d=canvas(800)
text(d,(40,25),'FOUR MOVEMENT REMINDERS',34)
for x,y,title in [(35,95,'WALL PUSH-UP'),(525,95,'SUPPORTED ROW'),(35,435,'GLUTE BRIDGE'),(525,435,'BIRD DOG')]:
    d.rounded_rectangle((x,y,x+435,y+315),radius=18,fill=LIGHT)
    text(d,(x+20,y+16),title,24)
# Wall push-up: straight body leaning toward a wall, hands on wall.
d.line([(395,160),(395,360)],fill=INK,width=7)
body(d,[(165,365),(245,282),(313,210)],(333,180))
d.line([(313,210),(350,244),(390,218)],fill=GREEN,width=10)
text(d,(55,378),'Keep your body aligned.',19)
# Row: hand supported, hinged torso, weight under shoulder.
d.line([(780,290),(935,290)],fill=INK,width=8)
d.line([(800,290),(800,357),(920,357),(920,290)],fill=INK,width=6)
body(d,[(625,365),(650,285),(687,221),(798,205)],(831,190))
d.line([(687,221),(724,285),(735,365)],fill=GREEN,width=10)
d.line([(798,205),(835,286)],fill=GREEN,width=10)
d.line([(780,210),(752,257),(790,280)],fill=GREEN,width=9)
d.rectangle((777,275,809,288),fill=INK)
text(d,(545,378),'Keep your torso steady.',19)
# Bridge, shoulders grounded, hips raised, knees bent, feet planted.
body(d,[(105,691),(185,640),(275,607),(340,691)],(77,686))
d.line([(100,698),(180,698)],fill=GREEN,width=9)
d.line([(318,697),(359,697)],fill=INK,width=9)
text(d,(55,718),'Lift hips without arching.',19)
# Bird dog: rear leg and opposite arm extended, other hand/knee grounded.
body(d,[(555,625),(667,625),(790,625)],(820,613))
d.line([(790,630),(810,700)],fill=GREEN,width=10)
d.line([(790,625),(910,615)],fill=GREEN,width=10)
d.line([(667,625),(685,700),(735,700)],fill=GREEN,width=10)
text(d,(545,718),'Reach without rotating.',19)
im.save(OUT/'exercise-patterns.png')

im,d=canvas(600)
text(d,(50,35),'YOUR FIRST EIGHT WEEKS',42)
text(d,(50,96),'A repeatable start to getting fitter',26)
for x,label,lines in [(50,'01 / LEARN',['Weeks 1–2','Practise movements','Find your starting level']), (360,'02 / REPEAT',['Weeks 3–4','Keep two strength days','Build your walking']), (670,'03 / PROGRESS',['Weeks 5–8','Add a little challenge','Check your training log'])]:
    d.rounded_rectangle((x,180,x+280,430),radius=20,fill=LIGHT)
    text(d,(x+18,206),label,25)
    for j,line in enumerate(lines): text(d,(x+18,275+j*38),line,20)
text(d,(50,488),'STRENGTH  +  AEROBIC ACTIVITY  +  FOOD  +  RECOVERY',24)
text(d,(50,537),'An example framework. Results and starting levels vary.',20)
im.save(OUT/'first-eight-weeks.png')
print('Generated 3 PNG illustrations and 1 animated GIF in', OUT)
