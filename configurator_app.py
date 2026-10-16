import os
import re
import tkinter as tk
from tkinter import messagebox, ttk

# Default configuration matching your exact intent (with Key 0 as the Triple-Tap Tool Opener)
default_keys_config = [
    {
        'id': 0,
        'category': 'TRIPLE_TAP',
        'val': 'open_firmware_editor',
        'label': 'Open Tool (3x Tap)',
    },
    {'id': 1, 'category': 'FUNC', 'val': 'do_screenshot', 'label': 'Screenshot'},
    {'id': 2, 'category': 'KEY', 'val': 'Keycode.HOME', 'label': 'Home'},
    {'id': 3, 'category': 'MOD', 'val': 'Keycode.ALT', 'label': 'Alt'},
    {'id': 4, 'category': 'KEY', 'val': 'Keycode.INSERT', 'label': 'Insert'},
    {'id': 5, 'category': 'LAUNCHER', 'val': 'Spotify', 'label': 'Spotify'},
    {'id': 6, 'category': 'KEY', 'val': 'Keycode.PAGE_DOWN', 'label': 'Page Down'},
    {
        'id': 7,
        'category': 'FUNC',
        'val': 'do_display_mode',
        'label': 'Display (Win+P)',
    },
    {
        'id': 8,
        'category': 'MEDIA',
        'val': 'ConsumerControlCode.BRIGHTNESS_DECREMENT',
        'label': 'Bright Down',
    },
    {
        'id': 9,
        'category': 'MEDIA',
        'val': 'ConsumerControlCode.BRIGHTNESS_INCREMENT',
        'label': 'Bright Up',
    },
    {
        'id': 10,
        'category': 'MEDIA',
        'val': 'ConsumerControlCode.PLAY_PAUSE',
        'label': 'Play/Pause',
    },
    {
        'id': 11,
        'category': 'FUNC',
        'val': 'do_airplane_mode',
        'label': 'Action Center',
    },
    {
        'id': 12,
        'category': 'LAUNCHER',
        'val': 'C:\\Program Files (x86)',
        'label': 'C:\\Program...',
    },
    {
        'id': 13,
        'category': 'MEDIA',
        'val': 'ConsumerControlCode.VOLUME_DECREMENT',
        'label': 'Vol Down',
    },
    {
        'id': 14,
        'category': 'MEDIA',
        'val': 'ConsumerControlCode.VOLUME_INCREMENT',
        'label': 'Vol Up',
    },
    {'id': 15, 'category': 'MOD', 'val': 'Keycode.CONTROL', 'label': 'Control'},
    {'id': 16, 'category': 'MOD', 'val': 'Keycode.WINDOWS', 'label': 'Windows'},
    {'id': 17, 'category': 'KEY', 'val': 'Keycode.DELETE', 'label': 'Delete'},
    {'id': 18, 'category': 'FUNC', 'val': 'do_lock', 'label': 'Lock PC'},
    {'id': 19, 'category': 'KEY', 'val': 'Keycode.SPACE', 'label': 'Space'},
]

options_data = {
    'KEY': [
        ('Keycode.ESCAPE', 'Escape (ESC)'),
        ('Keycode.ENTER', 'Enter'),
        ('Keycode.SPACE', 'Spacebar'),
        ('Keycode.BACKSPACE', 'Backspace'),
        ('Keycode.TAB', 'Tab'),
        ('Keycode.HOME', 'Home'),
        ('Keycode.DELETE', 'Delete'),
        ('Keycode.INSERT', 'Insert'),
        ('Keycode.PAGE_UP', 'Page Up'),
        ('Keycode.PAGE_DOWN', 'Page Down'),
    ],
    'MOD': [
        ('Keycode.ALT', 'Left Alt'),
        ('Keycode.CONTROL', 'Left Control'),
        ('Keycode.WINDOWS', 'Left Windows'),
        ('Keycode.SHIFT', 'Left Shift'),
    ],
    'MEDIA': [
        ('ConsumerControlCode.MUTE', 'Audio Mute'),
        ('ConsumerControlCode.VOLUME_INCREMENT', 'Volume Up'),
        ('ConsumerControlCode.VOLUME_DECREMENT', 'Volume Down'),
        ('ConsumerControlCode.PLAY_PAUSE', 'Play / Pause'),
        ('ConsumerControlCode.BRIGHTNESS_INCREMENT', 'Brightness Up'),
        ('ConsumerControlCode.BRIGHTNESS_DECREMENT', 'Brightness Down'),
    ],
    'FUNC': [
        ('do_screenshot', 'Screenshot (Win + Shift + S)'),
        ('do_display_mode', 'Change Display (Win + P)'),
        ('do_airplane_mode', 'Action Center (Win + A)'),
        ('do_lock', 'Lock PC (Win + L)'),
    ],
    'TRIPLE_TAP': [
        ('open_firmware_editor', 'Open Configurator Tool (3x Tap)'),
    ],
}


class MacroConfiguratorApp:

  def __init__(self, root):
    self.root = root
    self.root.title('Pico 5x4 Macro Configurator')
    self.root.geometry('880x580')
    self.root.configure(bg='#0f172a')

    self.selected_index = None
    self.keys_config = [dict(k) for k in default_keys_config]

    header = tk.Label(
        root,
        text='Pico 5x4 Macro Keyboard Configurator',
        font=('Arial', 16, 'bold'),
        fg='#ef4444',
        bg='#0f172a',
    )
    header.pack(pady=10)

    self.status_lbl = tk.Label(
        root, text='Initializing...', font=('Arial', 9), fg='#94a3b8', bg='#0f172a'
    )
    self.status_lbl.pack()

    main_frame = tk.Frame(root, bg='#0f172a')
    main_frame.pack(fill=tk.BOTH, expand=True, padx=15, pady=10)

    self.grid_frame = tk.Frame(main_frame, bg='#1e293b', bd=2, relief=tk.GROOVE)
    self.grid_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5, pady=5)

    tk.Label(
        self.grid_frame,
        text='Interactive 5x4 Matrix Layout',
        font=('Arial', 11, 'bold'),
        fg='#f8fafc',
        bg='#1e293b',
    ).pack(pady=10)

    self.buttons_grid = tk.Frame(self.grid_frame, bg='#1e293b')
    self.buttons_grid.pack(padx=10, pady=10)
    self.create_grid_buttons()

    self.sidebar = tk.Frame(
        main_frame, bg='#1e293b', bd=2, relief=tk.GROOVE, width=320
    )
    self.sidebar.pack(side=tk.RIGHT, fill=tk.Y, padx=5, pady=5)
    self.sidebar.pack_propagate(False)

    self.create_sidebar_widgets()

    btn_frame = tk.Frame(root, bg='#0f172a')
    btn_frame.pack(fill=tk.X, padx=20, pady=10)

    reload_btn = tk.Button(
        btn_frame,
        text='Reload from Pico',
        font=('Arial', 10, 'bold'),
        bg='#334155',
        fg='white',
        command=self.load_from_pico,
    )
    reload_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(0, 5))

    save_btn = tk.Button(
        btn_frame,
        text='Save code.py Directly to Pico',
        font=('Arial', 10, 'bold'),
        bg='#ef4444',
        fg='white',
        activebackground='#dc2626',
        activeforeground='white',
        command=self.save_to_pico,
    )
    save_btn.pack(side=tk.RIGHT, expand=True, fill=tk.X, padx=(5, 0))

    # Auto-load current config from Pico on startup
    self.load_from_pico(silent=True)

  def create_grid_buttons(self):
    self.grid_btns = []
    for idx, key in enumerate(self.keys_config):
      r = idx // 4
      c = idx % 4
      btn = tk.Button(
          self.buttons_grid,
          text=f"Key {idx}\n{key['label']}",
          font=('Arial', 8),
          width=12,
          height=3,
          bg='#334155',
          fg='#f8fafc',
          activebackground='#475569',
          activeforeground='#f8fafc',
          command=lambda i=idx: self.select_key(i),
      )
      btn.grid(row=r, column=c, padx=4, pady=4)
      self.grid_btns.append(btn)

  def create_sidebar_widgets(self):
    tk.Label(
        self.sidebar,
        text='Key Configuration',
        font=('Arial', 12, 'bold'),
        fg='#f8fafc',
        bg='#1e293b',
    ).pack(pady=15)

    self.lbl_selected = tk.Label(
        self.sidebar,
        text='Select a key from the grid',
        font=('Arial', 10),
        fg='#94a3b8',
        bg='#1e293b',
    )
    self.lbl_selected.pack(anchor='w', padx=15, pady=5)

    tk.Label(
        self.sidebar,
        text='Action Category:',
        font=('Arial', 9, 'bold'),
        fg='#94a3b8',
        bg='#1e293b',
    ).pack(anchor='w', padx=15, pady=(10, 2))

    self.category_var = tk.StringVar(value='KEY')
    self.category_dropdown = ttk.Combobox(
        self.sidebar,
        textvariable=self.category_var,
        values=[
            'KEY',
            'MOD',
            'MEDIA',
            'FUNC',
            'LAUNCHER',
            'TRIPLE_TAP',
        ],
        state='readonly',
    )
    self.category_dropdown.pack(fill=tk.X, padx=15, pady=5)
    self.category_dropdown.bind(
        '<<ComboboxSelected>>', self.on_category_change
    )

    self.lbl_val = tk.Label(
        self.sidebar,
        text='Assignment / Value:',
        font=('Arial', 9, 'bold'),
        fg='#94a3b8',
        bg='#1e293b',
    )
    self.lbl_val.pack(anchor='w', padx=15, pady=(10, 2))

    self.val_combo_var = tk.StringVar()
    self.val_combo = ttk.Combobox(
        self.sidebar, textvariable=self.val_combo_var, state='readonly'
    )
    self.val_combo.pack(fill=tk.X, padx=15, pady=5)
    self.val_combo.bind('<<ComboboxSelected>>', self.on_value_change)

    self.val_entry = tk.Entry(
        self.sidebar,
        font=('Arial', 10),
        bg='#0f172a',
        fg='#f8fafc',
        insertbackground='white',
    )
    self.val_entry.bind('<KeyRelease>', self.on_entry_change)

  def select_key(self, idx):
    self.selected_index = idx
    key = self.keys_config[idx]
    self.lbl_selected.config(
        text=f'Configuring Key {idx} (Row {idx//4}, Col {idx%4})'
    )

    self.category_var.set(key['category'])
    self.update_value_widget(key['category'])

    if key['category'] == 'LAUNCHER':
      self.val_entry.delete(0, tk.END)
      self.val_entry.insert(0, key['val'])
    else:
      self.val_combo_var.set(key['val'])

    for i, b in enumerate(self.grid_btns):
      b.config(bg='#0284c7' if i == idx else '#334155')

  def update_value_widget(self, category):
    if category == 'LAUNCHER':
      self.val_combo.pack_forget()
      self.val_entry.pack(fill=tk.X, padx=15, pady=5)
      self.lbl_val.config(text='App Name or Folder Path:')
    else:
      self.val_entry.pack_forget()
      self.val_combo.pack(fill=tk.X, padx=15, pady=5)
      self.lbl_val.config(text='Key / Action Assignment:')
      opts = options_data.get(category, [])
      self.val_combo['values'] = [o[0] for o in opts]

  def on_category_change(self, event):
    if self.selected_index is None:
      return
    cat = self.category_var.get()
    self.keys_config[self.selected_index]['category'] = cat
    self.update_value_widget(cat)

    if cat != 'LAUNCHER':
      opts = options_data.get(cat, [])
      if opts:
        self.keys_config[self.selected_index]['val'] = opts[0][0]
        self.keys_config[self.selected_index]['label'] = (
            opts[0][1].split('(')[0].strip()
        )
        self.val_combo_var.set(opts[0][0])
    else:
      self.keys_config[self.selected_index]['val'] = 'Spotify'
      self.keys_config[self.selected_index]['label'] = 'Spotify'
      self.val_entry.delete(0, tk.END)
      self.val_entry.insert(0, 'Spotify')
    self.refresh_grid_labels()

  def on_value_change(self, event):
    if self.selected_index is None:
      return
    val = self.val_combo_var.get()
    cat = self.category_var.get()
    opts = options_data.get(cat, [])
    label = val
    for o in opts:
      if o[0] == val:
        label = o[1].split('(')[0].strip()
        break
    self.keys_config[self.selected_index]['val'] = val
    self.keys_config[self.selected_index]['label'] = label
    self.refresh_grid_labels()

  def on_entry_change(self, event):
    if self.selected_index is None:
      return
    val = self.val_entry.get()
    self.keys_config[self.selected_index]['category'] = 'LAUNCHER'
    self.keys_config[self.selected_index]['val'] = val
    self.keys_config[self.selected_index]['label'] = (
        val if len(val) <= 10 else val[:8] + '...'
    )
    self.refresh_grid_labels()

  def refresh_grid_labels(self):
    for i, key in enumerate(self.keys_config):
      self.grid_btns[i].config(text=f"Key {i}\n{key['label']}")

  def find_pico_path(self):
    for letter in ['E', 'F', 'G', 'D', 'C', 'H']:
      path = f'{letter}:\\code.py'
      if os.path.exists(f'{letter}:\\'):
        if os.path.exists(f'{letter}:\\boot_out.txt') or os.path.exists(
            f'{letter}:\\lib'
        ):
          return path
    return 'E:\\code.py'

  def load_from_pico(self, silent=False):
    path = self.find_pico_path()
    if not os.path.exists(path):
      if not silent:
        messagebox.showwarning(
            'Not Found',
            f'Could not find code.py on Pico drive ({path}). Using default'
            ' configuration.',
        )
      self.status_lbl.config(
          text='Status: Pico drive not detected. Using defaults.', fg='#facc15'
      )
      return

    try:
      with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

      new_config = [dict(k) for k in default_keys_config]

      pattern = re.compile(
          r'(\d+)\s*:\s*\(\s*[\'"]([A-Z_]+)[\'"]\s*,\s*(.*?)\s*\)'
      )
      matches = pattern.findall(content)

      for key_id_str, cat, val in matches:
        kid = int(key_id_str)
        if 0 <= kid < 20:
          val_clean = val.rstrip(',').strip()
          if cat == 'LAUNCHER':
            if val_clean.startswith('"') and val_clean.endswith('"'):
              val_clean = val_clean[1:-1].replace('\\\\', '\\')
            elif val_clean.startswith("'") and val_clean.endswith("'"):
              val_clean = val_clean[1:-1].replace('\\\\', '\\')

          label = val_clean.split('.')[-1]
          if cat == 'LAUNCHER':
            label = val_clean if len(val_clean) <= 10 else val_clean[:8] + '...'
          elif cat == 'FUNC':
            label = (
                val_clean.replace('do_', '').replace('_', ' ').title()
            )

          new_config[kid] = {
              'id': kid,
              'category': cat,
              'val': val_clean,
              'label': label,
          }

      self.keys_config = new_config
      self.refresh_grid_labels()
      if self.selected_index is not None:
        self.select_key(self.selected_index)

      drive_letter = path.split(':')[0]
      self.status_lbl.config(
          text=(
              'Status: Successfully loaded current configuration from Pico'
              f' ({drive_letter}:\\)'
          ),
          fg='#4ade80',
      )
      if not silent:
        messagebox.showinfo(
            'Loaded', 'Successfully loaded current configuration from your Pico!'
        )
    except Exception as e:
      self.status_lbl.config(
          text=f'Status: Error reading Pico code.py ({e})', fg='#ef4444'
      )
      if not silent:
        messagebox.showerror(
            'Error', f'Failed to parse code.py from Pico: {e}'
        )

  def generate_firmware_code(self):
    mapping_lines = []
    for key in self.keys_config:
      kid = key['id']
      cat = key['category']
      val = key['val']

      if cat == 'TRIPLE_TAP':
        continue
      elif cat == 'LAUNCHER':
        safe_val = val.replace('\\', '\\\\').replace('"', '\\"')
        mapping_lines.append(f'    {kid}: (\'LAUNCHER\', "{safe_val}"),')
      elif cat in ('KEY', 'MOD'):
        mapping_lines.append(f"    {kid}: ('{cat}', {val}),")
      elif cat == 'MEDIA':
        mapping_lines.append(f'    {kid}: (\'MEDIA\', {val}),')
      elif cat == 'FUNC':
        mapping_lines.append(f'    {kid}: (\'FUNC\', {val}),')

    mapping_block = '\n'.join(mapping_lines)

    return f"""import board
import keypad
import usb_hid
import time
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS

ROW_PINS = (board.GP0, board.GP1, board.GP2, board.GP3, board.GP4)
COL_PINS = (board.GP5, board.GP6, board.GP7, board.GP8)

matrix = keypad.KeyMatrix(
    row_pins=ROW_PINS, column_pins=COL_PINS, columns_to_anodes=True
)

kbd = Keyboard(usb_hid.devices)
cc = ConsumerControl(usb_hid.devices)
layout = KeyboardLayoutUS(kbd)

def do_screenshot():
    kbd.send(Keycode.WINDOWS, Keycode.SHIFT, Keycode.S)

def do_display_mode():
    kbd.send(Keycode.WINDOWS, Keycode.P)

def do_airplane_mode():
    kbd.send(Keycode.WINDOWS, Keycode.A)

def do_lock():
    kbd.send(Keycode.WINDOWS, Keycode.L)

def launch_target(target):
    if '/' in target or '\\\\' in target or ':' in target:
        kbd.send(Keycode.WINDOWS, Keycode.R)
        time.sleep(0.3)
        layout.write(target)
        time.sleep(0.3)
        kbd.send(Keycode.ENTER)
    else:
        kbd.send(Keycode.WINDOWS, Keycode.S)
        time.sleep(0.3)
        layout.write(target)
        time.sleep(0.6)
        kbd.send(Keycode.ENTER)

def open_firmware_editor():
    kbd.send(Keycode.WINDOWS, Keycode.R)
    time.sleep(0.3)
    layout.write("PicoConfig")
    time.sleep(0.3)
    kbd.send(Keycode.ENTER)

last_press_time = 0
tap_count = 0
TAP_WINDOW = 0.5

KEY_MAPPING = {{
{mapping_block}
}}

print("5x4 Custom Macro Keyboard Initialized Successfully!")

while True:
    event = matrix.events.get()
    if event:
        key_idx = event.key_number
        
        if key_idx == 0:
            if event.pressed:
                current_time = time.monotonic()
                if current_time - last_press_time < TAP_WINDOW:
                    tap_count += 1
                else:
                    tap_count = 1
                last_press_time = current_time
                if tap_count == 3:
                    open_firmware_editor()
                    tap_count = 0
                    
        elif key_idx in KEY_MAPPING:
            action_type, action_val = KEY_MAPPING[key_idx]
            if action_type in ('KEY', 'MOD'):
                if event.pressed:
                    kbd.press(action_val)
                elif event.released:
                    kbd.release(action_val)
            elif action_type == 'MEDIA':
                if event.pressed:
                    cc.send(action_val)
            elif action_type == 'FUNC':
                if event.pressed:
                    action_val()
            elif action_type == 'LAUNCHER':
                if event.pressed:
                    launch_target(action_val)
"""

  def save_to_pico(self):
    path = self.find_pico_path()
    try:
      with open(path, 'w', encoding='utf-8') as f:
        f.write(self.generate_firmware_code())
      messagebox.showinfo('Success', f'Successfully wrote code.py to {path}!')
      self.status_lbl.config(
          text=f'Status: Saved successfully to {path}', fg='#4ade80'
      )
    except Exception as e:
      messagebox.showerror(
          'Error',
          f'Could not save to Pico: {e}\nMake sure your Pico is plugged in.',
      )


if __name__ == '__main__':
  root = tk.Tk()
  app = MacroConfiguratorApp(root)
  root.mainloop()