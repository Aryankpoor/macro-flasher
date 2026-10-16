import time
import board
import keypad
import usb_hid
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS

# Exact Row and Column pins from your PCB configuration
ROW_PINS = (board.GP0, board.GP1, board.GP2, board.GP3, board.GP4)
COL_PINS = (board.GP5, board.GP6, board.GP7, board.GP8)

# Initialize the 5x4 matrix
matrix = keypad.KeyMatrix(
    row_pins=ROW_PINS, column_pins=COL_PINS, columns_to_anodes=True
)

# Initialize USB HID devices
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
  if '/' in target or '\\' in target or ':' in target:
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
  # Opens Windows Run dialog and runs PowerShell to dynamically locate
  # the CIRCUITPY drive and execute configurator_app.py directly from the Pico.
  kbd.send(Keycode.WINDOWS, Keycode.R)
  time.sleep(0.3)
  ps_command = (
      'powershell -Command "$d = (Get-Volume -FileSystemLabel'
      " 'CIRCUITPY').DriveLetter; python ($d + ':\\configurator_app.py')\""
  )
  layout.write(ps_command)
  time.sleep(0.3)
  kbd.send(Keycode.ENTER)


# Triple-tap tracking variables for Key 0 (Top Left)
last_press_time = 0
tap_count = 0
TAP_WINDOW = 0.4  # Time window (in seconds) to register multi-taps

# Key mapping configuration for Keys 1 to 19 (Key 0 is handled separately below)
KEY_MAPPING = {
    1: ('FUNC', do_screenshot),
    2: ('KEY', Keycode.HOME),
    3: ('MOD', Keycode.ALT),
    4: ('KEY', Keycode.INSERT),
    5: ('LAUNCHER', 'Spotify'),
    6: ('KEY', Keycode.PAGE_DOWN),
    7: ('FUNC', do_display_mode),
    8: ('MEDIA', ConsumerControlCode.BRIGHTNESS_DECREMENT),
    9: ('MEDIA', ConsumerControlCode.BRIGHTNESS_INCREMENT),
    10: ('MEDIA', ConsumerControlCode.PLAY_PAUSE),
    11: ('FUNC', do_airplane_mode),
    12: ('LAUNCHER', 'C:\\Program Files (x86)'),
    13: ('MEDIA', ConsumerControlCode.VOLUME_DECREMENT),
    14: ('MEDIA', ConsumerControlCode.VOLUME_INCREMENT),
    15: ('MOD', Keycode.CONTROL),
    16: ('MOD', Keycode.WINDOWS),
    17: ('KEY', Keycode.DELETE),
    18: ('FUNC', do_lock),
    19: ('KEY', Keycode.SPACE),
}

print('5x4 Custom Macro Keyboard Initialized Successfully!')

while True:
  event = matrix.events.get()
  if event:
    key_idx = event.key_number

    # Key 0: Dual-function (Single tap = Escape, Triple tap = Open Configurator App)
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
        else:
          # Sends Escape on single presses
          kbd.send(Keycode.ESCAPE)

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