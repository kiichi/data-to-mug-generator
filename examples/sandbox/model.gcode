M105
M109 S0
M82 ;absolute extrusion mode
G28 ;Home
G1 Z15.0 F6000 ;Move the platform down 15mm
;Prime the extruder
G92 E0
G1 F2000 E0
M106 S255
; Movement Start ===============

; Movement End ===============
M107
M104 S0
M140 S0
;Retract the filament
G92 E1
G1 E-1 F300
G28 X0 Y0
M84
M82 ;absolute extrusion mode
;End of Gcode
