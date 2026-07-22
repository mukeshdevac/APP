from ten import Robot
import time

robot = Robot()

def main():
    robot.oled.clear()
    robot.oled.print("MOTOR TEST", 0, 0)
    
    # Simple movement sequence
    robot.oled.print("Moving Forward...", 0, 20)
    # Motor 1 and 2 at speed 50
    robot.set_motor(1, 1, 50) 
    robot.set_motor(2, 1, 50)
    time.sleep(2)
    
    robot.oled.print("Stopping", 0, 40)
    robot.set_motor(1, 1, 0)
    robot.set_motor(2, 1, 0)
    
    time.sleep(1)
    
    robot.oled.print("Spinning Left", 0, 60)
    robot.set_motor(1, 0, 50) # Backward
    robot.set_motor(2, 1, 50) # Forward
    time.sleep(1)
    
    robot.set_motor(1, 1, 0)
    robot.set_motor(2, 1, 0)
    robot.oled.print("Done!", 0, 80)

if __name__ == "__main__":
    main()
