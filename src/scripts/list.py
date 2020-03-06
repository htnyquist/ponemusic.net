#!/usr/bin/env python3
import os
import sys
import subprocess
import json
import sqlite3

class Song:
    def __init__(self, songs_root_path, artist, albums_path, song_title, song_format, duration, bitrate, freq_cutoff, has_cover_art, fingerprint):
        self.artist = artist
        self.albums_path = albums_path
        self.title = song_title
        self.fmt = song_format
        self.duration = duration
        self.bitrate = bitrate
        self.freq_cutoff = freq_cutoff
        self.has_cover_art = has_cover_art
        self.fingerprint = fingerprint.decode('utf-8')
        self.rel_path = os.path.join(self.artist, self.albums_path, self.title+'.'+self.fmt)
        self.full_path = os.path.join(songs_root_path, self.artist, self.albums_path, self.title+'.'+self.fmt)
        self.match = None
        self.match_score = 0.0

def import_songs_bitrates(db_path):
    db = sqlite3.connect(db_path)
    cur = db.cursor()
    cur.execute("SELECT value FROM info WHERE tag == 'songs_rel_path'")
    songs_path = os.path.join(os.path.dirname(db_path), cur.fetchone()[0])
    cur.execute('SELECT DISTINCT * FROM songs')

    song_bitrates = {}
    for row in cur.fetchall():
        song = Song(songs_path, *row)
        if song.albums_path == '.':
            song_path = os.path.join('.', 'Artists', song.artist, song.title+'.'+song.fmt)
        else:
            song_path = os.path.join('.', 'Artists', song.rel_path)
        if song.fmt == 'flac':
            song_bitrates[song_path] = 0
        else:
            song_bitrates[song_path] = int(song.bitrate/1000)

    cur.close()
    db.close()
    return songs_path, song_bitrates

def get_mp3_bitrate(path):
    output = subprocess.check_output(['ffprobe', '-show_streams', path], stderr=subprocess.DEVNULL).decode()
    for line in output.split('\n'):
        if line.startswith('bit_rate=') and not line.endswith('N/A'):
            return int(int(line[len('bit_rate='):]) / 1000)
    raise Exception(f'Failed to get bitrate for {path}')

def list_songs(path, song_bitrates):
    contents = {}
    
    if os.path.isdir(path):
        contents['id'] = os.path.basename(path)
        contents['list'] = []
        for dirent in os.listdir(path):
            contents['list'].append(list_songs(os.path.join(path, dirent), song_bitrates))
        contents['list'].sort(key=lambda e: ('1' if 'list' in e else '2') + e['id'].lower())
    else:
        contents['id'] = os.path.basename(path).rsplit('.', 1)[0]
        if not path.startswith('./Albums/'):
            contents['r'] = song_bitrates[path]
        elif path.rsplit('.', 1)[1] == 'flac':
            contents['r'] = 0
        else:
            contents['r'] = get_mp3_bitrate(path)
    
    return contents

if len(sys.argv) < 2:
    print('Usage: '+sys.argv[0]+' <song db>')
    sys.exit(-1)
db_path = sys.argv[1]
artists_path, song_bitrates = import_songs_bitrates(db_path)
pma_path = os.path.dirname(artists_path)
os.chdir(pma_path)

print(json.dumps(list_songs('.', song_bitrates), separators=(',',':')))
