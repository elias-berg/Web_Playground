import os
import subprocess

# Dear tabnabber.com,
#
# I'm sorry for stealing your sounds, but this is a free
# project anyway and I promise I won't run this script
# again any time soon.
#
# With love,
# Eli

start = 15
end = 75
notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
cmd1 = "curl 'https://tabnabber.com/documents/keymaps/audio/"
cmd2 = ".mp3' --silent --compressed --output tmp/"

os.mkdir("./tmp")

pos = 0
octave = 2
for x in range(start, end + 1):
    fullCmd = cmd1 + str(x) + cmd2 + str(notes[pos]) + str(octave) + ".mp3"
    pos = pos + 1
    if (pos == len(notes)):
        pos = 0
        octave = octave + 1
    print(fullCmd)
    subprocess.run(fullCmd, shell=True)