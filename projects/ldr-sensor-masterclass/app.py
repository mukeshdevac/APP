from ten import Robot
import time

robot = Robot()

def main():
    robot.oled.clear()
    robot.oled.print("LDR SENSOR TEST", 0, 0)
    
    while True:
        # LDR on Port 1
        light_level = robot.read_sensor(1)
        
        robot.oled.clear()
        robot.oled.print("LIGHT LEVEL:", 0, 0)
        robot.oled.print(str(light_level) + "%", 0, 20)
        
        if light_level < 30:
            robot.oled.print("ITS DARK!", 0, 40)
            robot.oled.print("LIGHTS ON", 0, 50)
            # You could add robot.led(1) here if available
        else:
            robot.oled.print("BRIGHT DAY", 0, 40)
            
        time.sleep(0.2)

if __name__ == "__main__":
    main()
