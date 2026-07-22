from ten import Robot
import time

# Advanced Robotics: Drive Systems Controller
# This script demonstrates "Compliance" mode vs "High Torque" mode
# through simulated gear ratios.

robot = Robot()

def run_mission():
    robot.oled.clear()
    robot.oled.print("DRIVE SYSTEM", 0)
    robot.oled.print("Initializing...", 1)
    time.sleep(1)
    
    # 1. Simulate Planetary Drive (10:1) - Quick & Compliant
    robot.oled.clear()
    robot.oled.print("Mode: Planetary", 0)
    robot.oled.print("Robot Dog Leg", 1)
    robot.motors[0].speed(30) # Moderate speed
    robot.motors[1].speed(30)
    time.sleep(2)
    robot.motors[0].stop()
    robot.motors[1].stop()
    
    # 2. Simulate Harmonic Drive (100:1) - High Precision
    robot.oled.clear()
    robot.oled.print("Mode: Harmonic", 0)
    robot.oled.print("Precision Arm", 1)
    # Slow, steady movement
    for i in range(10):
        robot.motors[0].speed(10)
        time.sleep(0.1)
    robot.motors[0].stop()
    
    # 3. Simulate Mars Rover Mode - Max Torque
    robot.oled.clear()
    robot.oled.print("Mode: Rover", 0)
    robot.oled.print("Climbing Rock...", 1)
    robot.motors[0].speed(100)
    robot.motors[1].speed(100)
    time.sleep(3)
    robot.motors[0].stop()
    robot.motors[1].stop()
    
    robot.oled.clear()
    robot.oled.print("Mission Done!", 0)

if __name__ == "__main__":
    run_mission()
