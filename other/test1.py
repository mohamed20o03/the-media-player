import tkinter as tk
from tkinter import filedialog
import pygame
import os
import eyed3

class MediaPlayer:
    def __init__(self):
        # Initialize pygame mixer for audio playback
        pygame.mixer.init()

        # Create a Tkinter window
        self.root = tk.Tk()
        self.root.title("Media Player")
        self.root.geometry("500x300")

        # Initialize playlist and index
        self.playlist = []
        self.current_index = 0

        # Create the GUI
        self.create_gui()

    def create_gui(self):
        # Frame for control buttons
        control_frame = tk.Frame(self.root)
        control_frame.pack(side=tk.BOTTOM, fill=tk.X)

        # Play, Pause, Stop buttons
        play_button = tk.Button(control_frame, text="Play", command=self.play)
        play_button.pack(side=tk.LEFT)

        pause_button = tk.Button(control_frame, text="Pause", command=self.pause)
        pause_button.pack(side=tk.LEFT)

        stop_button = tk.Button(control_frame, text="Stop", command=self.stop)
        stop_button.pack(side=tk.LEFT)

        # Next button
        next_button = tk.Button(control_frame, text="Next", command=self.next)
        next_button.pack(side=tk.LEFT)

        # Volume slider
        self.volume_slider = tk.Scale(control_frame, from_=0, to=1, resolution=0.01, orient=tk.HORIZONTAL,
                                      label="Volume", command=self.set_volume)
        self.volume_slider.set(0.5)
        self.volume_slider.pack(side=tk.RIGHT)

        # Playlist listbox
        self.playlist_listbox = tk.Listbox(self.root)
        self.playlist_listbox.pack(fill=tk.BOTH, expand=True)

        # Load files button
        load_files_button = tk.Button(control_frame, text="Load Files", command=self.load_files)
        load_files_button.pack(side=tk.RIGHT)

        # Label to display track info
        self.track_info_label = tk.Label(self.root, text="Track Info")
        self.track_info_label.pack(side=tk.TOP, fill=tk.X)

        # Bind the play_selected function to the listbox
        self.playlist_listbox.bind("<Double-Button-1>", self.play_selected)

    def load_files(self):
        # Open file dialog to select audio files
        file_paths = filedialog.askopenfilenames(title="Select MP3 Files", filetypes=[("MP3 Files", "*.mp3")])

        # Add files to the playlist
        if file_paths:
            for file_path in file_paths:
                # Add file path to playlist
                self.playlist.append(file_path)

                # Add file name to listbox
                file_name = os.path.basename(file_path)
                self.playlist_listbox.insert(tk.END, file_name)

    def play(self):
        # Play the current song
        if self.playlist:
            file_path = self.playlist[self.current_index]
            pygame.mixer.music.load(file_path)
            pygame.mixer.music.set_volume(self.volume_slider.get())
            pygame.mixer.music.play()
            self.display_track_info(file_path)

    def pause(self):
        # Pause the current song
        pygame.mixer.music.pause()

    def stop(self):
        # Stop the current song
        pygame.mixer.music.stop()

    def next(self):
        # Play the next song in the playlist
        if self.playlist:
            self.current_index = (self.current_index + 1) % len(self.playlist)
            self.play()

    def set_volume(self, value):
        # Set the volume
        pygame.mixer.music.set_volume(float(value))

    def play_selected(self, event):
        # Play the selected song from the playlist
        selection = self.playlist_listbox.curselection()
        if selection:
            index = selection[0]
            self.current_index = index
            self.play()

    def display_track_info(self, file_path):
        # Use eyed3 to access ID3 tags
        audio_file = eyed3.load(file_path)
        if audio_file is not None:
            id3_tag = audio_file.tag
            if id3_tag is not None:
                title = id3_tag.title if id3_tag.title else "Unknown Title"
                artist = id3_tag.artist if id3_tag.artist else "Unknown Artist"
                album = id3_tag.album if id3_tag.album else "Unknown Album"
                track_num = id3_tag.track_num[0] if id3_tag.track_num else "Unknown Track Number"

                # Display track information in the label
                track_info = f"Title: {title}\nArtist: {artist}\nAlbum: {album}\nTrack Number: {track_num}"
                self.track_info_label.config(text=track_info)

    def run(self):
        # Start the Tkinter main loop
        self.root.mainloop()


if __name__ == "__main__":
    # Create and run the media player
    player = MediaPlayer()
    player.run()
