from ten import Robot
import time

robot = Robot()

def main():
    robot.oled.clear()
    robot.oled.print("IR SENSOR TEST", 0, 0)
    robot.oled.print("Starting...", 0, 10)
    
    while True:
        # Assuming IR sensor is on port 1 (analog/digital)
        # We'll use a generic read for demonstration
        val = robot.read_sensor(1)
        
        robot.oled.clear()
        robot.oled.print("IR VALUE:", 0, 0)
        robot.oled.print(str(val), 0, 20)
        
        if val > 50:
            robot.oled.print("OBJECT DETECTED!", 0, 40)
        else:
            robot.oled.print("NO OBJECT", 0, 40)
            
        time.sleep(0.1)

if __name__ == "__main__":
    main()
