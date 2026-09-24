import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, ArrowLeft, Bot, Sparkles, Terminal, Zap, Upload, BookOpen, ChevronDown, ChevronRight, Code2, Copy, Check, FileCode, X, FolderOpen, Save, Edit3, RotateCcw, Download, Battery, Lightbulb, Tv, Radio, RotateCw, Fan, AlertTriangle, Maximize2, Sliders, Target, Search, Activity, Compass, Database, Cpu, GraduationCap } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { connectionManager } from '../../../utils/ConnectionManager';
import { toast } from '../../../hooks/useToast';
import BlocklyEditor from './BlocklyEditor';
import AIAgent from '../../ai-agent/components/AIAgent';
import SerialTerminal from '../../../components/common/SerialTerminal';
import useAppStore from '../../../store/appStore';
import InteractiveCurriculumGuide from './InteractiveCurriculumGuide';
import { CURRICULUM_MODULES } from '../data/curriculumData';

// Example projects with 1-click workspace loading & interactive curriculum pairing
const EXAMPLE_PROGRAMS = [
    {
        id: '00',
        name: "Serial Communication & Telemetry",
        category: "Basics",
        difficulty: "Beginner",
        desc: "High-speed UART serial logging, telemetry streaming, variable inspection and baud rates",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">=== Ten Robotics Serial Diagnostic ===</field></shadow></value><next><block type="controls_for"><field name="VAR">packet_id</field><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">10</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">1</field></shadow></value><statement name="DO"><block type="esp32_serial_print_var"><field name="LABEL">Packet #</field><value name="VAL"><block type="variables_get"><field name="VAR">packet_id</field></block></value><next><block type="esp32_serial_print_var"><field name="LABEL">Battery (V)</field><value name="VAL"><block type="esp32_get_battery"></block></value><next><block type="esp32_serial_print_var"><field name="LABEL">Sensor 1 Value</field><value name="VAL"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></statement><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Telemetry Stream Completed.</field></shadow></value></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '01',
        name: "LED Flasher & Counter",
        category: "Basics",
        difficulty: "Beginner",
        desc: "Repeat loop counting LED pulses with Serial monitor output",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">--- LED Cycle Starting ---</field></shadow></value><next><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value><statement name="DO"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value><next><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">0</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Pulse Completed</field></shadow></value></block></next></block></next></block></next></block></next></block></statement><next><block type="esp32_led_builtin"><field name="STATE">1</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_led_builtin"><field name="STATE">0</field><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">--- All Done! ---</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '02',
        name: "PWM LED Breathing Dimmer",
        category: "Basics",
        difficulty: "Beginner",
        desc: "Gradually fades LED brightness up and down using PWM duty cycle control",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Starting PWM Breathing...</field></shadow></value><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_for"><field name="VAR">duty</field><value name="FROM"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">1020</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">60</field></shadow></value><statement name="DO"><block type="esp32_pwm_write"><field name="PIN">18</field><value name="DUTY"><block type="variables_get"><field name="VAR">duty</field></block></value><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">25</field></shadow></value></block></next></block></statement><next><block type="controls_for"><field name="VAR">duty</field><value name="FROM"><shadow type="math_number"><field name="NUM">1020</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">-60</field></shadow></value><statement name="DO"><block type="esp32_pwm_write"><field name="PIN">18</field><value name="DUTY"><block type="variables_get"><field name="VAR">duty</field></block></value><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">25</field></shadow></value></block></next></block></statement><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">200</field></shadow></value></block></next></block></next></block></statement></block></next></block></next></block></xml>'
    },
    {
        id: '03',
        name: "Button Controlled Toggle",
        category: "Basics",
        difficulty: "Beginner",
        desc: "Poll push button input with software debouncing to toggle digital output pin",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Button Toggle Ready</field></shadow></value><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">EQ</field><value name="A"><block type="esp32_digital_read"><field name="PIN">16</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></value><statement name="DO0"><block type="esp32_digital_toggle"><field name="PIN">4</field><next><block type="esp32_led_builtin"><field name="STATE">1</field><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Button Pressed: Pin 4 Toggled!</field></shadow></value><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">300</field></shadow></value></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="esp32_led_builtin"><field name="STATE">0</field></block></statement><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></next></block></statement></block></next></block></next></block></xml>'
    },
    {
        id: '04',
        name: "Motor Speed Ramping",
        category: "Motors",
        difficulty: "Intermediate",
        desc: "For loop speed acceleration, telemetry logging and electric braking",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Accelerating Motor...</field></shadow></value><next><block type="controls_for"><field name="VAR">speed</field><value name="FROM"><shadow type="math_number"><field name="NUM">20</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">100</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">20</field></shadow></value><statement name="DO"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><block type="variables_get"><field name="VAR">speed</field></block></value><next><block type="esp32_serial_print_var"><field name="LABEL">Speed</field><value name="VAL"><block type="variables_get"><field name="VAR">speed</field></block></value><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">300</field></shadow></value></block></next></block></next></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_stop_all_motors"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Motor Safely Stopped</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '05',
        name: "Dual Servo Articulator",
        category: "Motors",
        difficulty: "Intermediate",
        desc: "Center calibration, smooth sweep movements and position telemetry",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_servo_center"><field name="PIN">1</field><next><block type="esp32_servo_center"><field name="PIN">2</field><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Servos Calibrated to 90 deg</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_servo_sweep"><field name="PIN">1</field><field name="STEP">5</field><field name="DELAY">20</field><value name="START"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="END"><shadow type="math_number"><field name="NUM">180</field></shadow></value><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">500</field></shadow></value><next><block type="esp32_servo_sweep"><field name="PIN">1</field><field name="STEP">5</field><field name="DELAY">20</field><value name="START"><shadow type="math_number"><field name="NUM">180</field></shadow></value><value name="END"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '06',
        name: "360° Continuous Servo Drive",
        category: "Motors",
        difficulty: "Intermediate",
        desc: "Control continuous rotation servos forward, reverse and stop transitions",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Continuous Servo Demo</field></shadow></value><next><block type="esp32_servo_360"><field name="PIN">1</field><field name="STATE">CW</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="esp32_servo_360"><field name="PIN">1</field><field name="STATE">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_servo_360"><field name="PIN">1</field><field name="STATE">CCW</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="esp32_servo_360"><field name="PIN">1</field><field name="STATE">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Servo Cycle Finished</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '07',
        name: "Stepper Precision Indexer",
        category: "Motors",
        difficulty: "Intermediate",
        desc: "Accurate angular indexing, full 360° rotation and automatic coil releasing",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Stepper Indexing 360 Deg CW</field></shadow></value><next><block type="esp32_stepper_degrees"><field name="DIR">CW</field><field name="DELAY">10</field><value name="DEGREES"><shadow type="math_number"><field name="NUM">360</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Stepper Returning 180 Deg CCW</field></shadow></value><next><block type="esp32_stepper_degrees"><field name="DIR">CCW</field><field name="DELAY">10</field><value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_stepper_stop"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Stepper Coils Released (Power Saved)</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '08',
        name: "Sensor Range Mapper",
        category: "Sensors",
        difficulty: "Intermediate",
        desc: "Maps 0-100% analog sensor reading into 0-180° servo angle with live OLED readout",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_servo_center"><field name="PIN">1</field><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">500</field></shadow></value><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="esp32_servo"><field name="PIN">1</field><value name="ANGLE"><block type="esp32_map"><value name="VAL"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="FROM_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="FROM_HIGH"><shadow type="math_number"><field name="NUM">100</field></shadow></value><value name="TO_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="TO_HIGH"><shadow type="math_number"><field name="NUM">180</field></shadow></value></block></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><block type="text_join"><mutation items="2"></mutation><value name="ADD0"><shadow type="text"><field name="TEXT">Sensor %: </field></shadow></value><value name="ADD1"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><block type="text_join"><mutation items="2"></mutation><value name="ADD0"><shadow type="text"><field name="TEXT">Servo Deg: </field></shadow></value><value name="ADD1"><block type="esp32_map"><value name="VAL"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="FROM_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="FROM_HIGH"><shadow type="math_number"><field name="NUM">100</field></shadow></value><value name="TO_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="TO_HIGH"><shadow type="math_number"><field name="NUM">180</field></shadow></value></block></value></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '09',
        name: "Smart Thermostat Fan",
        category: "Control",
        difficulty: "Intermediate",
        desc: "Closed-loop feedback: auto-trigger cooling fan & status LED by sensor threshold",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">GT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></value><statement name="DO0"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="ten_number_100"><field name="NUM">100</field></shadow></value><next><block type="esp32_led_builtin"><field name="STATE">1</field><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">FAN: ACTIVE (HIGH)</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></next></block></statement><statement name="ELSE"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="ten_number_100"><field name="NUM">0</field></shadow></value><next><block type="esp32_led_builtin"><field name="STATE">0</field><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">FAN: STANDBY (OFF)</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></next></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.2</field></shadow></value></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '10',
        name: "Ultrasonic Radar Alert",
        category: "Sensors",
        difficulty: "Intermediate",
        desc: "Proximity detection: multi-stage warning light & OLED alert for close objects",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_ultrasonic_read"><field name="TRIG">23</field><field name="ECHO">32</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">20</field></shadow></value></block></value><statement name="DO0"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">! DANGER: STOP !</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></statement><statement name="ELSE"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">0</field><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">CLEAR TO PROCEED</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></statement><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '11',
        name: "Battery Power Supervisor",
        category: "System",
        difficulty: "Intermediate",
        desc: "Real-time battery voltage monitoring with auto-cutoff motor safety",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_get_battery"></block></value><value name="B"><shadow type="math_number"><field name="NUM">20</field></shadow></value></block></value><statement name="DO0"><block type="esp32_stop_all_motors"><next><block type="esp32_led_builtin"><field name="STATE">1</field><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">CRITICAL: LOW BATT</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">MOTORS HALTED</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">3</field></shadow></value></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><block type="text_join"><mutation items="2"></mutation><value name="ADD0"><shadow type="text"><field name="TEXT">Battery: </field></shadow></value><value name="ADD1"><block type="esp32_get_battery"></block></value></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">POWER SYSTEM: OK</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">3</field></shadow></value></block></next></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '12',
        name: "OLED Live Dashboard",
        category: "Display",
        difficulty: "Advanced",
        desc: "Multi-line dashboard showing battery, voltage & live analog sensor telemetry",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="esp32_oled_clear"><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">TEN ROBOTICS OS</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><block type="text_join"><mutation items="2"></mutation><value name="ADD0"><shadow type="text"><field name="TEXT">Sensor: </field></shadow></value><value name="ADD1"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><block type="text_join"><mutation items="2"></mutation><value name="ADD0"><shadow type="text"><field name="TEXT">Battery: </field></shadow></value><value name="ADD1"><block type="esp32_get_battery"></block></value></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">4</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '13',
        name: "Robot Emotion Expressions",
        category: "Display",
        difficulty: "Advanced",
        desc: "Animated character expressions, dynamic gaze shifts and eye blinks",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="esp32_spidermaf_eyes"><field name="DIR">CENTER</field><field name="SIZE">16,7</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_spidermaf_eyes"><field name="DIR">LEFT</field><field name="SIZE">16,7</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.8</field></shadow></value><next><block type="esp32_spidermaf_eyes"><field name="DIR">RIGHT</field><field name="SIZE">16,7</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.8</field></shadow></value><next><block type="esp32_eyes_animate"><field name="ANIM">BLINK</field><field name="SPEED">35</field><next><block type="esp32_eyes_expression"><field name="MOOD">HAPPY</field><field name="LOOK">CENTER</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '14',
        name: "Emoji Status Display",
        category: "Display",
        difficulty: "Advanced",
        desc: "Cycle bitmap icons across OLED screen with animated moods and status flags",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="esp32_oled_emoji"><field name="NAME">smile</field><field name="POS">48,16</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value><next><block type="esp32_oled_emoji"><field name="NAME">cool</field><field name="POS">48,16</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value><next><block type="esp32_oled_emoji"><field name="NAME">robot</field><field name="POS">48,16</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value><next><block type="esp32_oled_emoji"><field name="NAME">surprised</field><field name="POS">48,16</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '15',
        name: "Obstacle Avoiding Rover",
        category: "Robotics",
        difficulty: "Advanced",
        desc: "Autonomous mobile rover navigation with reverse & spin evasive maneuvers",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_ultrasonic_read"><field name="TRIG">23</field><field name="ECHO">32</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value><statement name="DO0"><block type="esp32_stop_all_motors"><next><block type="esp32_oled_emoji"><field name="NAME">surprised</field><field name="POS">48,16</field><next><block type="esp32_dual_motor"><value name="LEFT_SPEED"><shadow type="math_number"><field name="NUM">-70</field></shadow></value><value name="RIGHT_SPEED"><shadow type="math_number"><field name="NUM">-70</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.6</field></shadow></value><next><block type="esp32_dual_motor"><value name="LEFT_SPEED"><shadow type="math_number"><field name="NUM">70</field></shadow></value><value name="RIGHT_SPEED"><shadow type="math_number"><field name="NUM">-70</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.4</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="esp32_oled_emoji"><field name="NAME">smile</field><field name="POS">48,16</field><next><block type="esp32_dual_motor"><value name="LEFT_SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><value name="RIGHT_SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value></block></next></block></statement><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '16',
        name: "Line Tracking Navigation",
        category: "Robotics",
        difficulty: "Advanced",
        desc: "Dual sensor differential steering algorithm to follow dark trajectory lines",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_ifelse"><value name="IF0"><block type="logic_operation"><field name="OP">AND</field><value name="A"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value><value name="B"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">2</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value></block></value><statement name="DO0"><block type="esp32_dual_motor"><value name="LEFT_SPEED"><shadow type="math_number"><field name="NUM">75</field></shadow></value><value name="RIGHT_SPEED"><shadow type="math_number"><field name="NUM">75</field></shadow></value></block></statement><statement name="ELSE"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value><statement name="DO0"><block type="esp32_dual_motor"><value name="LEFT_SPEED"><shadow type="math_number"><field name="NUM">30</field></shadow></value><value name="RIGHT_SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value></block></statement><statement name="ELSE"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">2</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value><statement name="DO0"><block type="esp32_dual_motor"><value name="LEFT_SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><value name="RIGHT_SPEED"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></statement><statement name="ELSE"><block type="esp32_stop_all_motors"></block></statement></block></statement></block></statement><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">20</field></shadow></value></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '17',
        name: "ESP-NOW Broadcaster",
        category: "Wireless",
        difficulty: "Advanced",
        desc: "Live ESP-NOW packet broadcasting with threshold alert and Serial logging",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="esp32_broadcast"><value name="VAL"><block type="esp32_sensor_read"><field name="PORT">2</field></block></value><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Packet Broadcasted via ESP-NOW</field></shadow></value><next><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">GT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">2</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">60</field></shadow></value></block></value><statement name="DO0"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field></block></statement><statement name="ELSE"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">0</field></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></statement></block></next></block></xml>'
    },
    {
        id: '18',
        name: "I2C Diagnostics & Temp",
        category: "System",
        difficulty: "Master",
        desc: "Bus scanner discovering hardware peripheral addresses & temperature sensor readings",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">--- Scanning I2C Bus ---</field></shadow></value><next><block type="esp32_i2c_scan"><next><block type="esp32_oled_clear"><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">I2C SCAN COMPLETE</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><block type="text_join"><mutation items="2"></mutation><value name="ADD0"><shadow type="text"><field name="TEXT">Temp C: </field></shadow></value><value name="ADD1"><block type="esp32_i2c_temp"><field name="ADDR">72</field></block></value></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '19',
        name: "MPU6050 Motion Tilt Alarm",
        category: "Sensors",
        difficulty: "Master",
        desc: "Read 6-DOF IMU accelerometer registers over I2C and trigger buzzer tilt alerts",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Initializing MPU6050 Accel...</field></shadow></value><next><block type="esp32_i2c_write"><field name="ADDR">104</field><field name="REG">107</field><value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="controls_ifelse"><value name="IF0"><block type="logic_compare"><field name="OP">GT</field><value name="A"><block type="esp32_i2c_mpu6050"><field name="AXIS">0x3B</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">8000</field></shadow></value></block></value><statement name="DO0"><block type="esp32_digital_write"><field name="PIN">33</field><field name="STATE">1</field><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">! TILT WARNING !</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></statement><statement name="ELSE"><block type="esp32_digital_write"><field name="PIN">33</field><field name="STATE">0</field><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">ROBOT LEVEL: OK</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></statement><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">150</field></shadow></value></block></next></block></statement></block></next></block></next></block></next></block></xml>'
    },
    {
        id: '20',
        name: "Array Data Logger & Mean",
        category: "Data",
        difficulty: "Master",
        desc: "Samples analog readings into an array list, calculates arithmetic average and displays telemetry",
        xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Sampling Sensor Array...</field></shadow></value><next><block type="variables_set"><field name="VAR">readings</field><value name="VALUE"><block type="lists_create_with"><mutation items="3"></mutation><value name="ADD0"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="ADD1"><block type="esp32_sensor_read"><field name="PORT">2</field></block></value><value name="ADD2"><block type="esp32_sensor_read"><field name="PORT">3</field></block></value></block></value><next><block type="esp32_oled_clear"><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><shadow type="text"><field name="TEXT">SENSOR DATA LOG</field></shadow></value><value name="LINE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="esp32_oled_print"><field name="SIZE">1</field><value name="TEXT"><block type="text_join"><mutation items="2"></mutation><value name="ADD0"><shadow type="text"><field name="TEXT">Avg Value: </field></shadow></value><value name="ADD1"><block type="math_on_list"><field name="OP">AVERAGE</field><value name="LIST"><block type="variables_get"><field name="VAR">readings</field></block></value></block></value></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="esp32_serial_print_var"><field name="LABEL">Average</field><value name="VAL"><block type="math_on_list"><field name="OP">AVERAGE</field><value name="LIST"><block type="variables_get"><field name="VAR">readings</field></block></value></block></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
    }
];

const EXAMPLE_ICONS = {
    '00': { icon: Terminal, gradient: 'linear-gradient(135deg, #0284C7, #0369A1)', shadow: 'rgba(2, 132, 199, 0.35)', badgeColor: '#0284C7', badgeBg: '#E0F2FE', badgeBorder: '#BAE6FD' },
    '01': { icon: Lightbulb, gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', shadow: 'rgba(245, 158, 11, 0.35)', badgeColor: '#D97706', badgeBg: '#FEF3C7', badgeBorder: '#FDE68A' },
    '02': { icon: Activity, gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', shadow: 'rgba(6, 182, 212, 0.35)', badgeColor: '#0891B2', badgeBg: '#CFFAFE', badgeBorder: '#A5F3FC' },
    '03': { icon: Target, gradient: 'linear-gradient(135deg, #10B981, #059669)', shadow: 'rgba(16, 185, 129, 0.35)', badgeColor: '#059669', badgeBg: '#D1FAE5', badgeBorder: '#A7F3D0' },
    '04': { icon: Zap, gradient: 'linear-gradient(135deg, #0284C7, #0369A1)', shadow: 'rgba(2, 132, 199, 0.35)', badgeColor: '#0284C7', badgeBg: '#E0F2FE', badgeBorder: '#BAE6FD' },
    '05': { icon: RotateCw, gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7)', shadow: 'rgba(14, 165, 233, 0.35)', badgeColor: '#0284C7', badgeBg: '#E0F2FE', badgeBorder: '#BAE6FD' },
    '06': { icon: Compass, gradient: 'linear-gradient(135deg, #0D9488, #0F766E)', shadow: 'rgba(13, 148, 136, 0.35)', badgeColor: '#0F766E', badgeBg: '#CCFBF1', badgeBorder: '#99F6E4' },
    '07': { icon: RotateCcw, gradient: 'linear-gradient(135deg, #9333EA, #7E22CE)', shadow: 'rgba(147, 51, 234, 0.35)', badgeColor: '#7E22CE', badgeBg: '#F3E8FF', badgeBorder: '#E9D5FF' },
    '08': { icon: Sliders, gradient: 'linear-gradient(135deg, #D946EF, #A21CAF)', shadow: 'rgba(217, 70, 239, 0.35)', badgeColor: '#A21CAF', badgeBg: '#FDF4FF', badgeBorder: '#F5D0FE' },
    '09': { icon: Fan, gradient: 'linear-gradient(135deg, #0284C7, #0369A1)', shadow: 'rgba(2, 132, 199, 0.35)', badgeColor: '#0369A1', badgeBg: '#E0F2FE', badgeBorder: '#BAE6FD' },
    '10': { icon: AlertTriangle, gradient: 'linear-gradient(135deg, #EF4444, #DC2626)', shadow: 'rgba(239, 68, 68, 0.35)', badgeColor: '#DC2626', badgeBg: '#FEE2E2', badgeBorder: '#FECACA' },
    '11': { icon: Battery, gradient: 'linear-gradient(135deg, #F97316, #C2410C)', shadow: 'rgba(249, 115, 22, 0.35)', badgeColor: '#C2410C', badgeBg: '#FFEDD5', badgeBorder: '#FED7AA' },
    '12': { icon: Tv, gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', shadow: 'rgba(139, 92, 246, 0.35)', badgeColor: '#7C3AED', badgeBg: '#EDE9FE', badgeBorder: '#DDD6FE' },
    '13': { icon: Bot, gradient: 'linear-gradient(135deg, #6366F1, #4338CA)', shadow: 'rgba(99, 102, 241, 0.35)', badgeColor: '#4338CA', badgeBg: '#EEF2FF', badgeBorder: '#C7D2FE' },
    '14': { icon: Sparkles, gradient: 'linear-gradient(135deg, #EC4899, #DB2777)', shadow: 'rgba(236, 72, 153, 0.35)', badgeColor: '#DB2777', badgeBg: '#FCE7F3', badgeBorder: '#FBCFE8' },
    '15': { icon: Bot, gradient: 'linear-gradient(135deg, #A855F7, #7E22CE)', shadow: 'rgba(168, 85, 247, 0.35)', badgeColor: '#7E22CE', badgeBg: '#F3E8FF', badgeBorder: '#E9D5FF' },
    '16': { icon: Compass, gradient: 'linear-gradient(135deg, #10B981, #047857)', shadow: 'rgba(16, 185, 129, 0.35)', badgeColor: '#059669', badgeBg: '#D1FAE5', badgeBorder: '#A7F3D0' },
    '17': { icon: Radio, gradient: 'linear-gradient(135deg, #059669, #047857)', shadow: 'rgba(5, 150, 105, 0.35)', badgeColor: '#047857', badgeBg: '#D1FAE5', badgeBorder: '#A7F3D0' },
    '18': { icon: Search, gradient: 'linear-gradient(135deg, #475569, #1E293B)', shadow: 'rgba(71, 85, 105, 0.35)', badgeColor: '#334155', badgeBg: '#F1F5F9', badgeBorder: '#CBD5E1' },
    '19': { icon: Cpu, gradient: 'linear-gradient(135deg, #E11D48, #BE123C)', shadow: 'rgba(225, 29, 72, 0.35)', badgeColor: '#BE123C', badgeBg: '#FFE4E6', badgeBorder: '#FECDD3' },
    '20': { icon: Database, gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)', shadow: 'rgba(37, 99, 235, 0.35)', badgeColor: '#1D4ED8', badgeBg: '#DBEAFE', badgeBorder: '#BFDBFE' },
};

const DIFFICULTY_STYLES = {
    'Beginner': {
        color: '#15803D',
        bg: '#DCFCE7',
        border: '#BBF7D0'
    },
    'Intermediate': {
        color: '#0284C7',
        bg: '#E0F2FE',
        border: '#BAE6FD'
    },
    'Advanced': {
        color: '#7C3AED',
        bg: '#EDE9FE',
        border: '#DDD6FE'
    },
    'Master': {
        color: '#DC2626',
        bg: '#FEE2E2',
        border: '#FECACA'
    }
};

const ExampleDropdown = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTier, setSelectedTier] = useState('All');
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 60);
        }
    }, [isOpen]);

    const handleItemClick = (item) => {
        setSelectedId(item.id);
        onSelect(item.xml, item.id);
        toast.success(`Loaded example: ${item.name}`);
        setIsOpen(false);
    };

    const tiers = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Master'];

    const filteredPrograms = useMemo(() => {
        return EXAMPLE_PROGRAMS.filter((p) => {
            const matchesTier = selectedTier === 'All' || p.difficulty === selectedTier;
            const term = searchTerm.trim().toLowerCase();
            const matchesSearch = !term ||
                p.name.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                p.desc.toLowerCase().includes(term) ||
                p.id.includes(term);
            return matchesTier && matchesSearch;
        });
    }, [selectedTier, searchTerm]);

    const tierCounts = useMemo(() => {
        const counts = { All: EXAMPLE_PROGRAMS.length, Beginner: 0, Intermediate: 0, Advanced: 0, Master: 0 };
        EXAMPLE_PROGRAMS.forEach(p => {
            if (counts[p.difficulty] !== undefined) counts[p.difficulty]++;
        });
        return counts;
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isOpen ? '#F1F5F9' : '#FFFFFF',
                    color: '#1E293B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                }}
            >
                <BookOpen size={14} color="#0284C7" />
                <span>Examples</span>
                <span style={{
                    background: '#E0F2FE',
                    color: '#0369A1',
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: '700'
                }}>
                    {EXAMPLE_PROGRAMS.length}
                </span>
                <ChevronDown
                    size={14}
                    color="#64748B"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            width: '410px',
                            maxWidth: '92vw',
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 24px 48px -8px rgba(15, 23, 42, 0.18), 0 4px 16px -2px rgba(15, 23, 42, 0.08)',
                            zIndex: 1000,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header with Title and Count */}
                        <div style={{
                            padding: '12px 16px 10px',
                            background: '#F8FAFC',
                            borderBottom: '1px solid #E2E8F0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#0F172A', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                        Example Projects
                                    </span>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: '700',
                                        background: '#E2E8F0',
                                        color: '#475569',
                                        padding: '1px 6px',
                                        borderRadius: '999px'
                                    }}>
                                        {filteredPrograms.length} / {EXAMPLE_PROGRAMS.length}
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '500' }}>
                                    Click project to load
                                </span>
                            </div>

                            {/* Search Bar Input */}
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '8px',
                                padding: '4px 10px',
                                gap: '8px',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                            }}>
                                <Search size={14} color="#94A3B8" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search 20 projects, sensors, motors..."
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '0.78rem',
                                        color: '#1E293B',
                                        background: 'transparent'
                                    }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#94A3B8'
                                        }}
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>

                            {/* Difficulty Tier Filter Pills */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflowX: 'auto', paddingBottom: '2px' }}>
                                {tiers.map((tier) => {
                                    const isActive = selectedTier === tier;
                                    const count = tierCounts[tier] || 0;
                                    const diffStyle = DIFFICULTY_STYLES[tier];
                                    return (
                                        <button
                                            key={tier}
                                            onClick={() => setSelectedTier(tier)}
                                            style={{
                                                border: isActive
                                                    ? '1px solid #0284C7'
                                                    : '1px solid #E2E8F0',
                                                background: isActive
                                                    ? '#0284C7'
                                                    : '#FFFFFF',
                                                color: isActive
                                                    ? '#FFFFFF'
                                                    : '#64748B',
                                                padding: '2px 8px',
                                                borderRadius: '999px',
                                                fontSize: '0.67rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                transition: 'all 0.14s ease'
                                            }}
                                        >
                                            <span>{tier}</span>
                                            <span style={{
                                                opacity: 0.85,
                                                fontSize: '0.62rem',
                                                background: isActive ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                                                padding: '0 4px',
                                                borderRadius: '6px'
                                            }}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Program List with Scroll */}
                        <div style={{
                            maxHeight: '410px',
                            overflowY: 'auto',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        }}>
                            {filteredPrograms.length === 0 ? (
                                <div style={{
                                    padding: '32px 16px',
                                    textAlign: 'center',
                                    color: '#94A3B8',
                                    fontSize: '0.78rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Search size={24} color="#CBD5E1" />
                                    <span>No matching projects found</span>
                                </div>
                            ) : (
                                filteredPrograms.map((item) => {
                                    const meta = EXAMPLE_ICONS[item.id] || {
                                        icon: Sparkles,
                                        gradient: 'linear-gradient(135deg, #0284C7, #0369A1)',
                                        shadow: 'rgba(2, 132, 199, 0.35)',
                                        badgeColor: '#0284C7',
                                        badgeBg: '#E0F2FE',
                                        badgeBorder: '#BAE6FD'
                                    };
                                    const diffMeta = DIFFICULTY_STYLES[item.difficulty] || DIFFICULTY_STYLES['Beginner'];
                                    const IconComponent = meta.icon;
                                    const isSelected = selectedId === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleItemClick(item)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '8px 10px',
                                                borderRadius: '11px',
                                                cursor: 'pointer',
                                                background: isSelected ? '#F0F9FF' : 'transparent',
                                                border: isSelected ? '1px solid #BAE6FD' : '1px solid transparent',
                                                boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.08)' : 'none',
                                                transition: 'all 0.16s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.background = '#F8FAFC';
                                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                                    e.currentTarget.style.transform = 'translateX(2px)';
                                                    const iconElem = e.currentTarget.querySelector('.example-icon-badge');
                                                    if (iconElem) iconElem.style.transform = 'scale(1.08)';
                                                    const chev = e.currentTarget.querySelector('.example-chevron');
                                                    if (chev) { chev.style.opacity = '1'; chev.style.transform = 'translateX(0)'; }
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.borderColor = 'transparent';
                                                    e.currentTarget.style.transform = 'none';
                                                    const iconElem = e.currentTarget.querySelector('.example-icon-badge');
                                                    if (iconElem) iconElem.style.transform = 'none';
                                                    const chev = e.currentTarget.querySelector('.example-chevron');
                                                    if (chev) { chev.style.opacity = '0'; chev.style.transform = 'translateX(-3px)'; }
                                                }
                                            }}
                                        >
                                            {/* Ultra-Premium Icon Badge */}
                                            <div
                                                className="example-icon-badge"
                                                style={{
                                                    position: 'relative',
                                                    width: '38px',
                                                    height: '38px',
                                                    borderRadius: '11px',
                                                    background: meta.gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    color: '#FFFFFF',
                                                    border: '1px solid rgba(255, 255, 255, 0.35)',
                                                    boxShadow: `0 4px 12px -1px ${meta.shadow}, 0 1px 2px rgba(0,0,0,0.06), inset 0 1.5px 2px rgba(255, 255, 255, 0.65), inset 0 -2px 3px rgba(0, 0, 0, 0.15)`,
                                                    transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                                                }}
                                            >
                                                <IconComponent
                                                    size={18}
                                                    strokeWidth={2.3}
                                                    style={{ filter: 'drop-shadow(0 1.5px 3px rgba(0,0,0,0.25))' }}
                                                />
                                            </div>

                                            {/* Title, Badges & Desc */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                                        <span style={{
                                                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                                                            fontSize: '0.68rem',
                                                            fontWeight: '800',
                                                            color: meta.badgeColor,
                                                            background: meta.badgeBg,
                                                            border: `1px solid ${meta.badgeBorder}`,
                                                            padding: '1px 5px',
                                                            borderRadius: '5px',
                                                            letterSpacing: '-0.2px',
                                                            flexShrink: 0
                                                        }}>
                                                            {item.id}
                                                        </span>
                                                        <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                                        <span style={{
                                                            fontSize: '0.62rem',
                                                            fontWeight: '700',
                                                            color: diffMeta.color,
                                                            background: diffMeta.bg,
                                                            border: `1px solid ${diffMeta.border}`,
                                                            padding: '1px 6px',
                                                            borderRadius: '5px'
                                                        }}>
                                                            {item.difficulty}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '0.62rem',
                                                            fontWeight: '700',
                                                            color: meta.badgeColor,
                                                            background: meta.badgeBg,
                                                            border: `1px solid ${meta.badgeBorder}`,
                                                            padding: '1px 6px',
                                                            borderRadius: '5px'
                                                        }}>
                                                            {item.category}
                                                        </span>
                                                        <ChevronRight
                                                            className="example-chevron"
                                                            size={14}
                                                            color="#94A3B8"
                                                            style={{
                                                                opacity: 0,
                                                                transform: 'translateX(-3px)',
                                                                transition: 'all 0.16s ease'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '0.71rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                                    {item.desc}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const IDE = ({ project, onBack, isConnected, setView, uploadProgress = 0, onUpload, logs, onClearLogs }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('preview'); // 'preview' or 'monitor'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [activeGuideModuleId, setActiveGuideModuleId] = useState('01_digital_output');
    const [sensorValue, setSensorValue] = useState(0);
    const [pythonCode, setPythonCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [copiedLogs, setCopiedLogs] = useState(false);
    const [isPythonEditing, setIsPythonEditing] = useState(false);
    const [isCustomPython, setIsCustomPython] = useState(false);
    const editorRef = React.useRef(null);
    const lastSensorUpdate = React.useRef(0);
    const blocksFileInputRef = useRef(null);
    const pythonFileInputRef = useRef(null);
    const lastGeneratedCode = useRef('');

    // Trigger Blockly resize on guide open/close to maintain smooth layout
    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 220);
        return () => clearTimeout(timer);
    }, [isGuideOpen]);

    const toggleSidebar = React.useCallback((tab) => {
        if (isSidebarOpen && sidebarTab === tab) {
            setIsSidebarOpen(false);
        } else {
            setSidebarTab(tab);
            setIsSidebarOpen(true);
        }
    }, [isSidebarOpen, sidebarTab]);

    const handleCopyCode = React.useCallback(() => {
        if (pythonCode) {
            navigator.clipboard.writeText(pythonCode);
            setCopied(true);
            toast.success("Python code copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    }, [pythonCode]);

    const handleCopyLogs = React.useCallback(() => {
        if (logs && logs.length > 0) {
            const raw = logs.join('');
            const clean = raw.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            navigator.clipboard.writeText(clean);
            setCopiedLogs(true);
            toast.success("Serial logs copied to clipboard!");
            setTimeout(() => setCopiedLogs(false), 2000);
        } else {
            toast.error("No serial logs to copy!");
        }
    }, [logs]);

    const handleCodeChange = React.useCallback((code) => {
        lastGeneratedCode.current = code;
        if (!isCustomPython) {
            setPythonCode(code);
        }
    }, [isCustomPython]);

    // Save Blocks to XML file
    const handleSaveBlocks = React.useCallback(() => {
        if (!editorRef.current) return;
        const xml = editorRef.current.getXml ? editorRef.current.getXml() : '';
        if (!xml || xml.trim() === '') {
            toast.error("No blocks in workspace to save!");
            return;
        }
        const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = (project?.title ? project.title.toLowerCase().replace(/\s+/g, '_') : 'robot_sketch') + '.xml';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Saved blocks as ${filename}`);
    }, [project]);

    // Open Blocks from XML file
    const handleOpenBlocksFile = React.useCallback((event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const xmlContent = e.target?.result;
            if (xmlContent && editorRef.current) {
                editorRef.current.loadXml(xmlContent);
                toast.success(`Opened blocks: ${file.name}`);
                setIsCustomPython(false);
            }
        };
        reader.onerror = () => {
            toast.error("Failed to read blocks file!");
        };
        reader.readAsText(file);
        event.target.value = '';
    }, []);

    // Save Python to .py file
    const handleSavePython = React.useCallback(() => {
        if (!pythonCode || !pythonCode.trim()) {
            toast.error("No Python code to save!");
            return;
        }
        const blob = new Blob([pythonCode], { type: 'text/x-python;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'main.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Saved Python code as main.py");
    }, [pythonCode]);

    // Open Python file
    const handleOpenPythonFile = React.useCallback((event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const code = e.target?.result;
            if (code !== undefined) {
                setPythonCode(code);
                setIsCustomPython(true);
                setIsPythonEditing(true);
                toast.success(`Loaded ${file.name} into Python editor`);
            }
        };
        reader.onerror = () => {
            toast.error("Failed to read Python file!");
        };
        reader.readAsText(file);
        event.target.value = '';
    }, []);

    // Re-sync Python from Blockly
    const handleSyncFromBlocks = React.useCallback(() => {
        if (lastGeneratedCode.current) {
            setPythonCode(lastGeneratedCode.current);
            setIsCustomPython(false);
            toast.success("Re-synced code from Blockly workspace!");
        }
    }, []);

    // Python Textarea Tab handler
    const handlePythonKeyDown = React.useCallback((e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const val = e.target.value;
            const newCode = val.substring(0, start) + '    ' + val.substring(end);
            setPythonCode(newCode);
            setIsCustomPython(true);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    }, []);

    const setModuleBlocks = useAppStore(s => s.setModuleBlocks);
    const moduleBlocks = useAppStore(s => s.moduleBlocks);
    const telemetry = useAppStore(s => s.telemetry);

    React.useEffect(() => {
        // Check if there are temporary module blocks to load
        if (moduleBlocks && editorRef.current) {
            console.log('[IDE] Loading temporary module blocks...');
            editorRef.current.loadXml(moduleBlocks);
            setModuleBlocks(null); // Clear after loading
        }
    }, [moduleBlocks, setModuleBlocks]);

    React.useEffect(() => {
        // Trigger resize events so Blockly recalculates dimensions perfectly once DOM and page animations settle
        const timer1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        const timer2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 850);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    React.useEffect(() => {
        connectionManager.onSensorUpdate = (val) => {
            const now = Date.now();
            if (now - lastSensorUpdate.current > 100) { // Throttle to 10Hz
                setSensorValue(val);
                lastSensorUpdate.current = now;
            }
        };

        const handleGlobalTrigger = () => {
            handleUpload();
        };
        window.addEventListener('GLOBAL_UPLOAD_TRIGGER', handleGlobalTrigger);

        return () => {
            connectionManager.onSensorUpdate = null;
            window.removeEventListener('GLOBAL_UPLOAD_TRIGGER', handleGlobalTrigger);
        };
    }, []);

    const handleRun = async () => {
        if (!isConnected) { 
            toast.error('Connect your ESP32 first!'); 
            return; 
        }
        setSidebarTab('monitor');
        setIsSidebarOpen(true);
        try {
            await connectionManager.runCode();
            toast.success('Run command sent to robot');
        } catch (err) {
            toast.error('Run failed: ' + err.message);
        }
    };

    const handleStop = async () => {
        if (!isConnected) { 
            toast.error('Connect your ESP32 first!'); 
            return; 
        }
        try {
            await connectionManager.stopCode();
            toast.info('Stop command sent to robot');
        } catch (err) {
            toast.error('Stop failed: ' + err.message);
        }
    };

    const handleUpload = async (codeOverride = null) => {
        const codeToUpload = codeOverride || pythonCode;

        if (!isConnected) {
            toast.error('Please connect your ESP32 first!');
            return;
        }

        if (!codeToUpload || !codeToUpload.trim()) {
            toast.error('No code available to upload!');
            return;
        }

        setSidebarTab('monitor');
        setIsSidebarOpen(true);
        if (onUpload) {
            await onUpload(codeToUpload);
        } else {
            setIsUploading(true);
            try {
                await connectionManager.uploadCode(codeToUpload);
                toast.success('Code uploaded successfully!');
            } catch (error) {
                toast.error('Upload failed: ' + error.message);
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="ten-blocks-theme" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxHeight: '100%',
            width: '100%',
            flex: 1,
            minHeight: 0,
            background: '#F8FAFC',
            color: '#0F172A',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            {/* TEN BLOCKS Header */}
            <div className="ide-header" style={{ flexShrink: 0 }}>
                <div className="ide-header-left">
                    <div onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569',
                            transition: 'all 0.15s ease'
                        }}>
                            <ArrowLeft size={18} />
                        </div>
                        <h1 style={{ color: '#0F172A', margin: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                            TEN BLOCKS
                        </h1>
                    </div>
                </div>

                <div className="ide-header-right">
                    <ExampleDropdown
                        onSelect={(xml, id) => {
                            if (editorRef.current) {
                                editorRef.current.loadXml(xml);
                            }
                            if (id) {
                                const matchingMod = CURRICULUM_MODULES.find(m => m.exampleId === id || m.id.startsWith(id));
                                if (matchingMod) {
                                    setActiveGuideModuleId(matchingMod.id);
                                }
                                setIsGuideOpen(true);
                            }
                        }}
                    />

                    {/* Dedicated Learning Academy Companion Button */}
                    <button
                        onClick={() => setIsGuideOpen(!isGuideOpen)}
                        title={isGuideOpen ? "Close Learning Companion Guide" : "Open Interactive Learning Guide"}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isGuideOpen ? '#EDE9FE' : '#FFFFFF',
                            color: isGuideOpen ? '#7C3AED' : '#1E293B',
                            border: isGuideOpen ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontSize: '0.82rem',
                            boxShadow: isGuideOpen ? '0 2px 8px rgba(124, 58, 237, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <GraduationCap size={15} color={isGuideOpen ? '#7C3AED' : '#8B5CF6'} />
                        <span>Guide</span>
                        <span style={{
                            background: isGuideOpen ? '#7C3AED' : '#F3E8FF',
                            color: isGuideOpen ? '#FFFFFF' : '#7C3AED',
                            fontSize: '0.64rem',
                            padding: '1px 5px',
                            borderRadius: '999px',
                            fontWeight: '800'
                        }}>
                            PRO
                        </span>
                    </button>

                    {/* Open & Save Blocks */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                            type="file"
                            ref={blocksFileInputRef}
                            accept=".xml,.blocks"
                            style={{ display: 'none' }}
                            onChange={handleOpenBlocksFile}
                        />
                        <button
                            onClick={() => blocksFileInputRef.current?.click()}
                            title="Open saved blocks file (.xml)"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#FFFFFF',
                                color: '#1E293B',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <FolderOpen size={14} color="#D97706" />
                            <span>Open Blocks</span>
                        </button>
                        <button
                            onClick={handleSaveBlocks}
                            title="Save workspace blocks (.xml)"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#FFFFFF',
                                color: '#1E293B',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Save size={14} color="#059669" />
                            <span>Save Blocks</span>
                        </button>
                    </div>

                    {/* Window Toggle Buttons: Show Code & Serial Monitor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                            onClick={() => toggleSidebar('preview')}
                            title={isSidebarOpen && sidebarTab === 'preview' ? "Hide Code Window" : "Show Code Window"}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: isSidebarOpen && sidebarTab === 'preview' ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
                                background: isSidebarOpen && sidebarTab === 'preview' ? '#E0F2FE' : '#FFFFFF',
                                color: isSidebarOpen && sidebarTab === 'preview' ? '#0284C7' : '#475569',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Code2 size={14} color={isSidebarOpen && sidebarTab === 'preview' ? '#0284C7' : '#64748B'} />
                            <span>Show Code</span>
                        </button>
                        <button
                            onClick={() => toggleSidebar('monitor')}
                            title={isSidebarOpen && sidebarTab === 'monitor' ? "Hide Serial Monitor" : "Show Serial Monitor"}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: isSidebarOpen && sidebarTab === 'monitor' ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
                                background: isSidebarOpen && sidebarTab === 'monitor' ? '#E0F2FE' : '#FFFFFF',
                                color: isSidebarOpen && sidebarTab === 'monitor' ? '#0284C7' : '#475569',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Terminal size={14} color={isSidebarOpen && sidebarTab === 'monitor' ? '#0284C7' : '#64748B'} />
                            <span>Serial Monitor</span>
                        </button>
                    </div>

                    <div className="ide-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                            onClick={handleStop} 
                            title="Stop robot execution"
                            style={{ 
                                background: '#FEE2E2', 
                                color: '#DC2626', 
                                border: '1px solid #FECACA', 
                                padding: '6px 14px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontWeight: '700', 
                                fontSize: '0.82rem',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <div style={{ width: '8px', height: '8px', background: '#DC2626', borderRadius: '2px' }} /> STOP
                        </button>
                        <button 
                            onClick={handleRun} 
                            title="Run loaded program on robot"
                            style={{ 
                                background: '#ECFDF5', 
                                color: '#059669', 
                                border: '1px solid #A7F3D0', 
                                padding: '6px 14px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontWeight: '700', 
                                fontSize: '0.82rem',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Play size={13} fill="#059669" color="#059669" /> RUN
                        </button>
                        <button 
                            onClick={() => handleUpload()} 
                            disabled={isUploading || uploadProgress > 0 || !isConnected}
                            title="Upload code to robot flash memory"
                            style={{ 
                                background: 'linear-gradient(135deg, #0284C7, #0369A1)', 
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px', 
                                padding: '6px 16px', 
                                fontWeight: '700',
                                fontSize: '0.82rem',
                                cursor: (!isConnected || isUploading || uploadProgress > 0) ? 'not-allowed' : 'pointer',
                                opacity: (!isConnected || isUploading || uploadProgress > 0) ? 0.6 : 1,
                                boxShadow: (!isConnected || isUploading || uploadProgress > 0) ? 'none' : '0 2px 6px rgba(2, 132, 199, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Upload size={14} />
                            {uploadProgress > 0 ? `UPLOADING ${uploadProgress}%` : (isUploading ? 'UPLOADING...' : 'UPLOAD')}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden', padding: '8px', gap: '8px', minHeight: 0, height: '100%', boxSizing: 'border-box' }}>
                {/* Full Blockly Workspace Area with Dynamic Flex */}
                <div style={{ 
                    flex: isGuideOpen ? '1 1 58%' : '1 1 100%', 
                    minWidth: 0,
                    position: 'relative', 
                    overflow: 'hidden', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)', 
                    background: 'white', 
                    height: '100%', 
                    minHeight: 0,
                    transition: 'flex 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <BlocklyEditor ref={editorRef} project={project} onCodeChange={handleCodeChange} />
                </div>

                {/* Side-by-Side Interactive Learning Companion Window */}
                <AnimatePresence>
                    {isGuideOpen && (
                        <Motion.div
                            initial={{ opacity: 0, width: 0, x: 20 }}
                            animate={{ opacity: 1, width: '45%', x: 0 }}
                            exit={{ opacity: 0, width: 0, x: 20 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                minWidth: '420px',
                                maxWidth: '640px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                flexShrink: 0
                            }}
                        >
                            <InteractiveCurriculumGuide
                                activeModuleId={activeGuideModuleId}
                                onSelectModule={(modId) => setActiveGuideModuleId(modId)}
                                onLoadXml={(xml) => {
                                    if (editorRef.current && editorRef.current.loadXml) {
                                        editorRef.current.loadXml(xml);
                                    }
                                }}
                                onClose={() => setIsGuideOpen(false)}
                            />
                        </Motion.div>
                    )}
                </AnimatePresence>

                {/* Apple Notebook Floating Window with AnimatePresence */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(15, 23, 42, 0.45)',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                padding: '16px',
                                boxSizing: 'border-box',
                                overflow: 'hidden'
                            }}
                        >
                            <Motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: isMaximized ? 'calc(100% - 16px)' : 'min(860px, calc(100% - 24px))',
                                    height: isMaximized ? 'calc(100% - 16px)' : 'min(500px, calc(100% - 28px))',
                                    maxWidth: 'calc(100% - 16px)',
                                    maxHeight: 'calc(100% - 20px)',
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    transformOrigin: 'center center',
                                    willChange: 'transform, opacity'
                                }}
                            >
                                {/* Apple macOS Window Titlebar */}
                                <div style={{
                                    height: '46px',
                                    background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
                                    borderBottom: '1px solid #E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0 16px',
                                    userSelect: 'none',
                                    flexShrink: 0
                                }}>
                                    {/* Indian Flag Colors Traffic Light Buttons */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
                                        {/* Saffron / Kesari */}
                                        <div
                                            onClick={() => setIsSidebarOpen(false)}
                                            title="Close (Saffron)"
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                                borderRadius: '50%',
                                                background: '#FF9933',
                                                border: '1px solid #E67E22',
                                                cursor: 'pointer',
                                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
                                                transition: 'transform 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.18)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        />
                                        {/* White with 24-Spoke Ashoka Chakra Navy Blue Wheel */}
                                        <div
                                            onClick={() => setIsSidebarOpen(false)}
                                            title="Minimize (Ashoka Chakra 24-Spoke Wheel)"
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                                borderRadius: '50%',
                                                background: '#FFFFFF',
                                                cursor: 'pointer',
                                                boxShadow: '0 0 0 1px #000080, inset 0 0 1px rgba(0,0,128,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'transform 0.15s ease',
                                                overflow: 'hidden'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.18)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" style={{ display: 'block' }}>
                                                <circle cx="12" cy="12" r="10.5" fill="#FFFFFF" stroke="#000080" strokeWidth="1.6" />
                                                <circle cx="12" cy="12" r="2.4" fill="#000080" />
                                                {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
                                                    <line
                                                        key={deg}
                                                        x1="12"
                                                        y1="12"
                                                        x2={12 + 10.5 * Math.cos((deg * Math.PI) / 180)}
                                                        y2={12 + 10.5 * Math.sin((deg * Math.PI) / 180)}
                                                        stroke="#000080"
                                                        strokeWidth="1"
                                                    />
                                                ))}
                                                <circle cx="12" cy="12" r="4.2" fill="none" stroke="#000080" strokeWidth="0.8" />
                                            </svg>
                                        </div>
                                        {/* India Green */}
                                        <div
                                            onClick={() => setIsMaximized(!isMaximized)}
                                            title={isMaximized ? "Restore Size (Green)" : "Maximize Window (Green)"}
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                                borderRadius: '50%',
                                                background: '#138808',
                                                border: '1px solid #0D5C06',
                                                cursor: 'pointer',
                                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
                                                transition: 'transform 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.18)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        />
                                    </div>

                                    {/* Center: Apple Pill Segmented Switcher */}
                                    <div style={{
                                        display: 'flex',
                                        background: '#E2E8F0',
                                        padding: '3px',
                                        borderRadius: '999px',
                                        gap: '2px'
                                    }}>
                                        <button
                                            onClick={() => setSidebarTab('preview')}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 16px',
                                                borderRadius: '999px',
                                                border: 'none',
                                                background: sidebarTab === 'preview' ? '#FFFFFF' : 'transparent',
                                                color: sidebarTab === 'preview' ? '#0F172A' : '#64748B',
                                                boxShadow: sidebarTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                fontSize: '0.78rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Code2 size={14} color={sidebarTab === 'preview' ? '#0284C7' : '#64748B'} />
                                            <span>Python Notebook</span>
                                        </button>
                                        <button
                                            onClick={() => setSidebarTab('monitor')}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 16px',
                                                borderRadius: '999px',
                                                border: 'none',
                                                background: sidebarTab === 'monitor' ? '#FFFFFF' : 'transparent',
                                                color: sidebarTab === 'monitor' ? '#0F172A' : '#64748B',
                                                boxShadow: sidebarTab === 'monitor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                fontSize: '0.78rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Terminal size={14} color={sidebarTab === 'monitor' ? '#0284C7' : '#64748B'} />
                                            <span>Serial Monitor</span>
                                        </button>
                                    </div>

                                    {/* Right Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px', justifyContent: 'flex-end' }}>
                                        {/* Battery Percentage Only - Kept strictly on Serial Monitor */}
                                        {sidebarTab === 'monitor' && (
                                            <div
                                                title={telemetry?.v ? `Battery: ${telemetry?.pct ?? 0}% (${telemetry.v.toFixed(2)}V)` : `Battery: ${telemetry?.pct ?? 0}%`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '4px 10px',
                                                    borderRadius: '999px',
                                                    background: '#FFFFFF',
                                                    border: '1px solid #E2E8F0',
                                                    fontSize: '0.74rem',
                                                    fontWeight: '700',
                                                    color: (telemetry?.pct ?? 0) > 20 ? '#059669' : '#DC2626',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                                }}
                                            >
                                                <Battery size={14} color={(telemetry?.pct ?? 0) > 20 ? '#059669' : '#DC2626'} />
                                                <span>{(telemetry?.pct !== undefined && telemetry?.pct > 0) ? `${telemetry.pct}%` : (isConnected ? '100%' : '0%')}</span>
                                            </div>
                                        )}

                                        {/* Copy button - Kept strictly on Serial Monitor */}
                                        {sidebarTab === 'monitor' && (
                                            <button
                                                onClick={handleCopyLogs}
                                                title="Copy Serial Monitor Output"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    background: copiedLogs ? '#DCFCE7' : '#FFFFFF',
                                                    color: copiedLogs ? '#15803D' : '#475569',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '6px',
                                                    padding: '4px 10px',
                                                    fontSize: '0.74rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {copiedLogs ? <Check size={12} color="#15803D" /> : <Copy size={12} />}
                                                <span>{copiedLogs ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsSidebarOpen(false)}
                                            title="Close Notebook"
                                            style={{
                                                width: '26px',
                                                height: '26px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#64748B',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Notebook Content */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                                    <AnimatePresence mode="wait">
                                        {sidebarTab === 'preview' ? (
                                            <Motion.div
                                                key="tab-preview"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.12 }}
                                                style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0F172A', overflow: 'hidden', minHeight: 0 }}
                                            >
                                            {/* Subheader info bar */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '7px 16px',
                                                background: '#1E293B',
                                                borderBottom: '1px solid #334155',
                                                fontSize: '0.74rem',
                                                color: '#94A3B8',
                                                flexWrap: 'wrap',
                                                gap: '8px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FileCode size={13} color="#38BDF8" />
                                                    <span style={{ color: '#F1F5F9', fontFamily: 'monospace', fontWeight: '600' }}>
                                                        main.py
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.64rem',
                                                        fontWeight: '700',
                                                        color: '#38BDF8',
                                                        background: 'rgba(56, 189, 248, 0.12)',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px',
                                                        border: '1px solid rgba(56, 189, 248, 0.25)'
                                                    }}>
                                                        MicroPython
                                                    </span>
                                                    {isCustomPython ? (
                                                        <span style={{
                                                            fontSize: '0.64rem',
                                                            fontWeight: '700',
                                                            color: '#F59E0B',
                                                            background: 'rgba(245, 158, 11, 0.15)',
                                                            padding: '1px 6px',
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(245, 158, 11, 0.3)'
                                                        }}>
                                                            ✏️ Custom (Edited)
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            fontSize: '0.64rem',
                                                            fontWeight: '700',
                                                            color: '#10B981',
                                                            background: 'rgba(16, 185, 129, 0.15)',
                                                            padding: '1px 6px',
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(16, 185, 129, 0.3)'
                                                        }}>
                                                            ⚡ Auto-Synced
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Python Editor Actions: Open, Save, Edit, Sync, Copy */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <input
                                                        type="file"
                                                        ref={pythonFileInputRef}
                                                        accept=".py,.txt"
                                                        style={{ display: 'none' }}
                                                        onChange={handleOpenPythonFile}
                                                    />
                                                    <button
                                                        onClick={() => pythonFileInputRef.current?.click()}
                                                        title="Open .py file"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: '#0F172A',
                                                            color: '#94A3B8',
                                                            border: '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <FolderOpen size={12} color="#D97706" />
                                                        <span>Open</span>
                                                    </button>
                                                    <button
                                                        onClick={handleSavePython}
                                                        title="Save Python code as main.py"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: '#0F172A',
                                                            color: '#94A3B8',
                                                            border: '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Download size={12} color="#059669" />
                                                        <span>Save</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setIsPythonEditing(!isPythonEditing)}
                                                        title={isPythonEditing ? "Lock Editor (Read-Only)" : "Unlock for Direct Python Editing"}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: isPythonEditing ? 'rgba(56, 189, 248, 0.2)' : '#0F172A',
                                                            color: isPythonEditing ? '#38BDF8' : '#94A3B8',
                                                            border: isPythonEditing ? '1px solid #38BDF8' : '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Edit3 size={12} color={isPythonEditing ? '#38BDF8' : '#94A3B8'} />
                                                        <span>{isPythonEditing ? 'Editing' : 'Edit'}</span>
                                                    </button>
                                                    {isCustomPython && (
                                                        <button
                                                            onClick={handleSyncFromBlocks}
                                                            title="Discard manual edits and sync from Blockly"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                background: '#0F172A',
                                                                color: '#F59E0B',
                                                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                                                borderRadius: '5px',
                                                                padding: '3px 8px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: '600',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <RotateCcw size={12} />
                                                            <span>Sync Blocks</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={handleCopyCode}
                                                        title="Copy Python Code"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: copied ? '#064E3B' : '#0F172A',
                                                            color: copied ? '#34D399' : '#94A3B8',
                                                            border: copied ? '1px solid #059669' : '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {copied ? <Check size={12} /> : <Copy size={12} />}
                                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Code Editor Body with Line Numbers */}
                                            <div style={{
                                                flex: 1,
                                                overflowY: 'auto',
                                                padding: '12px 0',
                                                fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', Menlo, Consolas, monospace",
                                                fontSize: '0.84rem',
                                                lineHeight: '1.65',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                {!pythonCode ? (
                                                    <div style={{ padding: '40px 20px', color: '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
                                                        # Drag blocks onto workspace or open a Python file to start coding...
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', minWidth: '100%', flex: 1 }}>
                                                        <div style={{
                                                            padding: '0 12px 0 16px',
                                                            color: '#475569',
                                                            textAlign: 'right',
                                                            userSelect: 'none',
                                                            fontSize: '0.76rem',
                                                            lineHeight: '1.65',
                                                            borderRight: '1px solid #1E293B',
                                                            minWidth: '38px',
                                                            flexShrink: 0
                                                        }}>
                                                            {pythonCode.split('\n').map((_, idx) => (
                                                                <div key={idx}>{idx + 1}</div>
                                                            ))}
                                                        </div>
                                                        {isPythonEditing ? (
                                                            <textarea
                                                                value={pythonCode}
                                                                onChange={(e) => {
                                                                    setPythonCode(e.target.value);
                                                                    setIsCustomPython(true);
                                                                }}
                                                                onKeyDown={handlePythonKeyDown}
                                                                spellCheck={false}
                                                                style={{
                                                                    flex: 1,
                                                                    margin: 0,
                                                                    padding: '0 18px',
                                                                    color: '#38BDF8',
                                                                    fontSize: '0.84rem',
                                                                    lineHeight: '1.65',
                                                                    fontFamily: 'inherit',
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    outline: 'none',
                                                                    resize: 'none',
                                                                    whiteSpace: 'pre',
                                                                    overflowX: 'auto',
                                                                    tabSize: 4
                                                                }}
                                                            />
                                                        ) : (
                                                            <pre style={{
                                                                margin: 0,
                                                                padding: '0 18px',
                                                                color: '#E2E8F0',
                                                                fontSize: '0.84rem',
                                                                lineHeight: '1.65',
                                                                fontFamily: 'inherit',
                                                                whiteSpace: 'pre',
                                                                overflowX: 'auto',
                                                                flex: 1
                                                            }}>
                                                                <code>{pythonCode}</code>
                                                            </pre>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            </Motion.div>
                                        ) : (
                                            <Motion.div
                                                key="tab-monitor"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.12 }}
                                                style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0F172A', overflow: 'hidden', minHeight: 0 }}
                                            >
                                                {/* Embedded Serial Terminal */}
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                                                    <SerialTerminal logs={logs} onClear={onClearLogs} isEmbedded={true} />
                                                </div>
                                            </Motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default IDE;
