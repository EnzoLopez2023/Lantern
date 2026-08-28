export interface FullSourceFile { path: string; code: string }

export const FULL_SOURCE: Record<string, FullSourceFile[]> = {
  s3: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
  ],
  s4: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []

func _ready() -> void:
	_init_grid()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))
` },
  ],
  s5: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb
` },
  ],
  s6: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
  ],
  s7: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score
` },
  ],
  s8: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score
` },
  ],
  s9: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	pass

func _update_preview() -> void:
	pass

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return
` },
  ],
  s10: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

func can_place(_anchor: Vector2i, _cells: Array) -> bool:
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	pass

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)
` },
  ],
  s11: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	pass

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)
` },
  ],
  s12: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	return 0

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _apply_clear_score(lines: int) -> void:
	pass

func _after_placement() -> void:
	pass

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()
` },
  ],
  s13: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found
	for y in full_rows:
		for x in range(GRID):
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _apply_clear_score(lines: int) -> void:
	pass

func _after_placement() -> void:
	pass

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()
` },
  ],
  s14: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found
	for y in full_rows:
		for x in range(GRID):
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()

func _after_placement() -> void:
	pass

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()
` },
  ],
  s15: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found
	for y in full_rows:
		for x in range(GRID):
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _is_game_over() -> bool:
	return false

func _show_game_over() -> void:
	pass

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live
` },
  ],
  s16: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found
	for y in full_rows:
		for x in range(GRID):
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	pass

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live
` },
  ],
  s17: [
    { path: "scripts/GameState.gd", code: `extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
` },
    { path: "scripts/Sfx.gd", code: `extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.

func play_pick() -> void: pass

func play_place() -> void: pass

func play_clear() -> void: pass

func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.

func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).

func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.

func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.

func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found
	for y in full_rows:
		for x in range(GRID):
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.

static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel

func _ready() -> void:
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	set_process_input(true)
	_update_score_label()
` },
  ],
  s18: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: Sfx)
extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.
func play_pick() -> void: pass
func play_place() -> void: pass
func play_clear() -> void: pass
func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found
	for y in full_rows:
		for x in range(GRID):
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel

func _ready() -> void:
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	set_process_input(true)
	_update_score_label()
` },
  ],
  s19: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: Sfx)
extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.
func play_pick() -> void: pass
func play_place() -> void: pass
func play_clear() -> void: pass
func play_over() -> void: pass
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	set_process_input(true)
	_update_score_label()
` },
  ],
  s20: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files.
func _play(p: AudioStreamPlayer) -> void:
	if p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	set_process_input(true)
	_update_score_label()
` },
  ],
  s21: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({ "best": best }))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files.
func _play(p: AudioStreamPlayer) -> void:
	if p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	set_process_input(true)
	_update_score_label()
` },
  ],
  s22: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({ "best": best }))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files.
func _play(p: AudioStreamPlayer) -> void:
	if p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)

func _on_play() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	set_process_input(true)
	_update_score_label()
` },
  ],
  s23: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({ "best": best }))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files.
func _play(p: AudioStreamPlayer) -> void:
	if p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)

func _on_play() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")
` },
  ],
  s24: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({ "best": best }))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files.
func _play(p: AudioStreamPlayer) -> void:
	if p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)

func _on_play() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)
	# Keep the score below the notch / Dynamic Island on real devices.
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)
	Input.vibrate_handheld(40)   # ~40ms buzz on a clear (real device only)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")
` },
  ],
  s31: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0
var sound_on: bool = true
var haptics_on: bool = true

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({
			"best": best,
			"sound_on": sound_on,
			"haptics_on": haptics_on,
		}))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))
		sound_on = bool(data.get("sound_on", true))
		haptics_on = bool(data.get("haptics_on", true))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files,
# and respects the player's Sound setting.
func _play(p: AudioStreamPlayer) -> void:
	if GameState.sound_on and p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)

func _on_play() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel
@onready var settings_panel := $HUD/SettingsPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)
	# Keep the score below the notch / Dynamic Island on real devices.
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)
	# Settings overlay: reflect saved prefs, and persist on every toggle.
	var sound_check := settings_panel.get_node("CenterContainer/VBox/SoundCheck")
	var haptics_check := settings_panel.get_node("CenterContainer/VBox/HapticsCheck")
	sound_check.button_pressed = GameState.sound_on
	haptics_check.button_pressed = GameState.haptics_on
	sound_check.toggled.connect(func(on): GameState.sound_on = on; GameState.save())
	haptics_check.toggled.connect(func(on): GameState.haptics_on = on; GameState.save())
	settings_panel.get_node("CenterContainer/VBox/Close").pressed.connect(func(): settings_panel.visible = false)
	# The guide never provides a way to open the settings overlay — add one on the pause menu.
	pause_panel.get_node("CenterContainer/VBoxContainer/Settings").pressed.connect(_on_settings)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)
	if GameState.haptics_on:
		Input.vibrate_handheld(40)   # ~40ms buzz on a clear (real device only)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")

func _on_settings() -> void:
	settings_panel.visible = true
` },
  ],
  s32: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0
var sound_on: bool = true
var haptics_on: bool = true

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({
			"best": best,
			"sound_on": sound_on,
			"haptics_on": haptics_on,
		}))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))
		sound_on = bool(data.get("sound_on", true))
		haptics_on = bool(data.get("haptics_on", true))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files,
# and respects the player's Sound setting.
func _play(p: AudioStreamPlayer) -> void:
	if GameState.sound_on and p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }

# --- Difficulty & weighting (Chapter 29) ---
# Each shape paired with a weight (higher = more common).
const WEIGHTED := [
	{ "cells": [Vector2i(0,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(0,1)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], "w": 4 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)], "w": 3 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], "w": 1 },
]

# Sum weights, roll in that range, walk the list until we cross zero.
static func weighted_piece() -> Dictionary:
	var total := 0
	for s in WEIGHTED:
		total += s["w"]
	var roll := randi() % total
	for s in WEIGHTED:
		roll -= s["w"]
		if roll < 0:
			return { "cells": s["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	# Fallback (shouldn't happen):
	return random_piece()

# Harder pieces get more likely once the player is doing well.
static func weighted_piece_for_score(score: int) -> Dictionary:
	var hard := score > 1500          # ramp in after a while
	var total := 0
	var weights := []
	for s in WEIGHTED:
		var w: int = s["w"]
		if hard:
			w = max(1, w + s["cells"].size() - 3)   # favor bigger pieces
		weights.append(w)
		total += w
	var roll := randi() % total
	for i in range(WEIGHTED.size()):
		roll -= weights[i]
		if roll < 0:
			return { "cells": WEIGHTED[i]["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	return random_piece()
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)

func _on_play() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel
@onready var settings_panel := $HUD/SettingsPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)
	# Keep the score below the notch / Dynamic Island on real devices.
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)
	# Settings overlay: reflect saved prefs, and persist on every toggle.
	var sound_check := settings_panel.get_node("CenterContainer/VBox/SoundCheck")
	var haptics_check := settings_panel.get_node("CenterContainer/VBox/HapticsCheck")
	sound_check.button_pressed = GameState.sound_on
	haptics_check.button_pressed = GameState.haptics_on
	sound_check.toggled.connect(func(on): GameState.sound_on = on; GameState.save())
	haptics_check.toggled.connect(func(on): GameState.haptics_on = on; GameState.save())
	settings_panel.get_node("CenterContainer/VBox/Close").pressed.connect(func(): settings_panel.visible = false)
	# The guide never provides a way to open the settings overlay — add one on the pause menu.
	pause_panel.get_node("CenterContainer/VBoxContainer/Settings").pressed.connect(_on_settings)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)
	if GameState.haptics_on:
		Input.vibrate_handheld(40)   # ~40ms buzz on a clear (real device only)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")

func _on_settings() -> void:
	settings_panel.visible = true
` },
  ],
  s33: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0
var sound_on: bool = true
var haptics_on: bool = true

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({
			"best": best,
			"sound_on": sound_on,
			"haptics_on": haptics_on,
		}))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))
		sound_on = bool(data.get("sound_on", true))
		haptics_on = bool(data.get("haptics_on", true))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files,
# and respects the player's Sound setting.
func _play(p: AudioStreamPlayer) -> void:
	if GameState.sound_on and p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# --- Daily challenge / seeding (Chapter 30) ---
# A dedicated RNG so the daily mode doesn't disturb normal random play.
static var rng := RandomNumberGenerator.new()
static var use_seeded := false

static func start_daily() -> void:
	var d := Time.get_date_dict_from_system()
	# Turn the date into a stable number, e.g. 20260714
	rng.seed = d.year * 10000 + d.month * 100 + d.day
	use_seeded = true

static func start_endless() -> void:
	use_seeded = false

static func _rand_index(n: int) -> int:
	return rng.randi() % n if use_seeded else randi() % n

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[_rand_index(SHAPES.size())]
	var color: Color = PALETTE[_rand_index(PALETTE.size())]
	return { "cells": shape, "color": color }

# --- Difficulty & weighting (Chapter 29) ---
# Each shape paired with a weight (higher = more common).
const WEIGHTED := [
	{ "cells": [Vector2i(0,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(0,1)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], "w": 4 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)], "w": 3 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], "w": 1 },
]

# Sum weights, roll in that range, walk the list until we cross zero.
static func weighted_piece() -> Dictionary:
	var total := 0
	for s in WEIGHTED:
		total += s["w"]
	var roll := randi() % total
	for s in WEIGHTED:
		roll -= s["w"]
		if roll < 0:
			return { "cells": s["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	# Fallback (shouldn't happen):
	return random_piece()

# Harder pieces get more likely once the player is doing well.
static func weighted_piece_for_score(score: int) -> Dictionary:
	var hard := score > 1500          # ramp in after a while
	var total := 0
	var weights := []
	for s in WEIGHTED:
		var w: int = s["w"]
		if hard:
			w = max(1, w + s["cells"].size() - 3)   # favor bigger pieces
		weights.append(w)
		total += w
	var roll := randi() % total
	for i in range(WEIGHTED.size()):
		roll -= weights[i]
		if roll < 0:
			return { "cells": WEIGHTED[i]["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	return random_piece()
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)
	$CenterContainer/VBoxContainer/Daily.pressed.connect(_on_daily)

func _on_play() -> void:
	Pieces.start_endless()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_daily() -> void:
	Pieces.start_daily()
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel
@onready var settings_panel := $HUD/SettingsPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)
	# Keep the score below the notch / Dynamic Island on real devices.
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)
	# Settings overlay: reflect saved prefs, and persist on every toggle.
	var sound_check := settings_panel.get_node("CenterContainer/VBox/SoundCheck")
	var haptics_check := settings_panel.get_node("CenterContainer/VBox/HapticsCheck")
	sound_check.button_pressed = GameState.sound_on
	haptics_check.button_pressed = GameState.haptics_on
	sound_check.toggled.connect(func(on): GameState.sound_on = on; GameState.save())
	haptics_check.toggled.connect(func(on): GameState.haptics_on = on; GameState.save())
	settings_panel.get_node("CenterContainer/VBox/Close").pressed.connect(func(): settings_panel.visible = false)
	# The guide never provides a way to open the settings overlay — add one on the pause menu.
	pause_panel.get_node("CenterContainer/VBoxContainer/Settings").pressed.connect(_on_settings)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)
	if GameState.haptics_on:
		Input.vibrate_handheld(40)   # ~40ms buzz on a clear (real device only)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")

func _on_settings() -> void:
	settings_panel.visible = true
` },
  ],
  s34: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0
var sound_on: bool = true
var haptics_on: bool = true
var resume_requested: bool = false   # runtime-only: set by menu's Continue button

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({
			"best": best,
			"sound_on": sound_on,
			"haptics_on": haptics_on,
		}))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))
		sound_on = bool(data.get("sound_on", true))
		haptics_on = bool(data.get("haptics_on", true))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files,
# and respects the player's Sound setting.
func _play(p: AudioStreamPlayer) -> void:
	if GameState.sound_on and p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

# --- Serialization for resume (Chapter 31) ---
# Export the grid as hex strings (or "" for empty).
func to_data() -> Array:
	var rows: Array = []
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			var c = grid[y][x]
			row.append(c.to_html() if c != null else "")
		rows.append(row)
	return rows

func from_data(rows: Array) -> void:
	_init_grid()
	for y in range(min(GRID, rows.size())):
		for x in range(min(GRID, rows[y].size())):
			var s: String = rows[y][x]
			if s != "":
				grid[y][x] = Color.html(s)
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# --- Daily challenge / seeding (Chapter 30) ---
# A dedicated RNG so the daily mode doesn't disturb normal random play.
static var rng := RandomNumberGenerator.new()
static var use_seeded := false

static func start_daily() -> void:
	var d := Time.get_date_dict_from_system()
	# Turn the date into a stable number, e.g. 20260714
	rng.seed = d.year * 10000 + d.month * 100 + d.day
	use_seeded = true

static func start_endless() -> void:
	use_seeded = false

static func _rand_index(n: int) -> int:
	return rng.randi() % n if use_seeded else randi() % n

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[_rand_index(SHAPES.size())]
	var color: Color = PALETTE[_rand_index(PALETTE.size())]
	return { "cells": shape, "color": color }

# --- Difficulty & weighting (Chapter 29) ---
# Each shape paired with a weight (higher = more common).
const WEIGHTED := [
	{ "cells": [Vector2i(0,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(0,1)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], "w": 4 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)], "w": 3 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], "w": 1 },
]

# Sum weights, roll in that range, walk the list until we cross zero.
static func weighted_piece() -> Dictionary:
	var total := 0
	for s in WEIGHTED:
		total += s["w"]
	var roll := randi() % total
	for s in WEIGHTED:
		roll -= s["w"]
		if roll < 0:
			return { "cells": s["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	# Fallback (shouldn't happen):
	return random_piece()

# Harder pieces get more likely once the player is doing well.
static func weighted_piece_for_score(score: int) -> Dictionary:
	var hard := score > 1500          # ramp in after a while
	var total := 0
	var weights := []
	for s in WEIGHTED:
		var w: int = s["w"]
		if hard:
			w = max(1, w + s["cells"].size() - 3)   # favor bigger pieces
		weights.append(w)
		total += w
	var roll := randi() % total
	for i in range(WEIGHTED.size()):
		roll -= weights[i]
		if roll < 0:
			return { "cells": WEIGHTED[i]["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	return random_piece()
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

const GAME_SAVE := "user://blockblast.game"

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)
	$CenterContainer/VBoxContainer/Daily.pressed.connect(_on_daily)
	# Continue only appears when an in-progress game was saved.
	var cont := $CenterContainer/VBoxContainer/Continue
	cont.visible = FileAccess.file_exists(GAME_SAVE)
	cont.pressed.connect(_on_continue)

func _on_play() -> void:
	Pieces.start_endless()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_daily() -> void:
	Pieces.start_daily()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_continue() -> void:
	GameState.resume_requested = true
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row
const GAME_SAVE := "user://blockblast.game"

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
var _over := false              # true once game over — stops resume-saving
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel
@onready var settings_panel := $HUD/SettingsPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	# Resume a saved game if the menu's Continue was tapped; otherwise deal fresh.
	if GameState.resume_requested and load_game():
		GameState.resume_requested = false
	else:
		GameState.resume_requested = false
		deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)
	# Keep the score below the notch / Dynamic Island on real devices.
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)
	# Settings overlay: reflect saved prefs, and persist on every toggle.
	var sound_check := settings_panel.get_node("CenterContainer/VBox/SoundCheck")
	var haptics_check := settings_panel.get_node("CenterContainer/VBox/HapticsCheck")
	sound_check.button_pressed = GameState.sound_on
	haptics_check.button_pressed = GameState.haptics_on
	sound_check.toggled.connect(func(on): GameState.sound_on = on; GameState.save())
	haptics_check.toggled.connect(func(on): GameState.haptics_on = on; GameState.save())
	settings_panel.get_node("CenterContainer/VBox/Close").pressed.connect(func(): settings_panel.visible = false)
	# The guide never provides a way to open the settings overlay — add one on the pause menu.
	pause_panel.get_node("CenterContainer/VBoxContainer/Settings").pressed.connect(_on_settings)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)
	if GameState.haptics_on:
		Input.vibrate_handheld(40)   # ~40ms buzz on a clear (real device only)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	_over = true
	_clear_saved_game()         # a finished game must not resume
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	_over = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")

func _on_settings() -> void:
	settings_panel.visible = true

# --- Resume a saved game (Chapter 31) ---
func _tray_to_data() -> Array:
	var out: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			var cell_list: Array = []
			for c in p.cells:
				cell_list.append([c.x, c.y])
			out.append({ "cells": cell_list, "color": p.color.to_html() })
		else:
			out.append(null)
	return out

func save_game() -> void:
	if _over:
		return                          # don't persist a finished game
	var data := {
		"score": GameState.score,
		"board": $Board.to_data(),
		"tray": _tray_to_data(),
	}
	var f := FileAccess.open(GAME_SAVE, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))
		f.close()

func has_saved_game() -> bool:
	return FileAccess.file_exists(GAME_SAVE)

func _clear_saved_game() -> void:
	if FileAccess.file_exists(GAME_SAVE):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(GAME_SAVE))

func load_game() -> bool:
	if not has_saved_game():
		return false
	var f := FileAccess.open(GAME_SAVE, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) != TYPE_DICTIONARY:
		return false
	GameState.score = int(data.get("score", 0))
	$Board.from_data(data.get("board", []))
	_restore_tray(data.get("tray", []))
	_update_score_label()
	return true

# Rebuild the on-screen tray pieces from saved data — the guide references
# _restore_tray() but never defines it, so this mirrors deal_tray() from data.
func _restore_tray(saved: Array) -> void:
	for i in range(3):
		_free_slot(i)
	for i in range(min(3, saved.size())):
		var entry = saved[i]
		if entry == null:
			continue
		var cells: Array = []
		for c in entry.get("cells", []):
			cells.append(Vector2i(int(c[0]), int(c[1])))
		var color := Color.html(entry.get("color", "ffffff"))
		var piece: Piece = piece_scene.instantiate()
		piece.setup({ "cells": cells, "color": color }, TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save_game()
` },
  ],
  s35: [
    { path: "scripts/GameState.gd", code: `# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0
var sound_on: bool = true
var haptics_on: bool = true
var reduce_motion: bool = false
var resume_requested: bool = false   # runtime-only: set by menu's Continue button

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({
			"best": best,
			"sound_on": sound_on,
			"haptics_on": haptics_on,
			"reduce_motion": reduce_motion,
		}))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))
		sound_on = bool(data.get("sound_on", true))
		haptics_on = bool(data.get("haptics_on", true))
		reduce_motion = bool(data.get("reduce_motion", false))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()
` },
    { path: "scripts/Sfx.gd", code: `# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files,
# and respects the player's Sound setting.
func _play(p: AudioStreamPlayer) -> void:
	if GameState.sound_on and p and p.stream:
		p.play()
` },
    { path: "scripts/Board.gd", code: `# scripts/Board.gd
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

# --- Serialization for resume (Chapter 31) ---
# Export the grid as hex strings (or "" for empty).
func to_data() -> Array:
	var rows: Array = []
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			var c = grid[y][x]
			row.append(c.to_html() if c != null else "")
		rows.append(row)
	return rows

func from_data(rows: Array) -> void:
	_init_grid()
	for y in range(min(GRID, rows.size())):
		for x in range(min(GRID, rows[y].size())):
			var s: String = rows[y][x]
			if s != "":
				grid[y][x] = Color.html(s)
	queue_redraw()
` },
    { path: "scripts/Pieces.gd", code: `# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# --- Daily challenge / seeding (Chapter 30) ---
# A dedicated RNG so the daily mode doesn't disturb normal random play.
static var rng := RandomNumberGenerator.new()
static var use_seeded := false

static func start_daily() -> void:
	var d := Time.get_date_dict_from_system()
	# Turn the date into a stable number, e.g. 20260714
	rng.seed = d.year * 10000 + d.month * 100 + d.day
	use_seeded = true

static func start_endless() -> void:
	use_seeded = false

static func _rand_index(n: int) -> int:
	return rng.randi() % n if use_seeded else randi() % n

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[_rand_index(SHAPES.size())]
	var color: Color = PALETTE[_rand_index(PALETTE.size())]
	return { "cells": shape, "color": color }

# --- Difficulty & weighting (Chapter 29) ---
# Each shape paired with a weight (higher = more common).
const WEIGHTED := [
	{ "cells": [Vector2i(0,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(0,1)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], "w": 4 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)], "w": 3 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], "w": 1 },
]

# Sum weights, roll in that range, walk the list until we cross zero.
static func weighted_piece() -> Dictionary:
	var total := 0
	for s in WEIGHTED:
		total += s["w"]
	var roll := randi() % total
	for s in WEIGHTED:
		roll -= s["w"]
		if roll < 0:
			return { "cells": s["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	# Fallback (shouldn't happen):
	return random_piece()

# Harder pieces get more likely once the player is doing well.
static func weighted_piece_for_score(score: int) -> Dictionary:
	var hard := score > 1500          # ramp in after a while
	var total := 0
	var weights := []
	for s in WEIGHTED:
		var w: int = s["w"]
		if hard:
			w = max(1, w + s["cells"].size() - 3)   # favor bigger pieces
		weights.append(w)
		total += w
	var roll := randi() % total
	for i in range(WEIGHTED.size()):
		roll -= weights[i]
		if roll < 0:
			return { "cells": WEIGHTED[i]["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	return random_piece()
` },
    { path: "scripts/Piece.gd", code: `# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))
` },
    { path: "scripts/Menu.gd", code: `# scripts/Menu.gd
extends Control

const GAME_SAVE := "user://blockblast.game"

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)
	$CenterContainer/VBoxContainer/Daily.pressed.connect(_on_daily)
	# Continue only appears when an in-progress game was saved.
	var cont := $CenterContainer/VBoxContainer/Continue
	cont.visible = FileAccess.file_exists(GAME_SAVE)
	cont.pressed.connect(_on_continue)

func _on_play() -> void:
	Pieces.start_endless()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_daily() -> void:
	Pieces.start_daily()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_continue() -> void:
	GameState.resume_requested = true
	get_tree().change_scene_to_file("res://scenes/game.tscn")
` },
    { path: "scripts/Game.gd", code: `# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row
const GAME_SAVE := "user://blockblast.game"

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
var _over := false              # true once game over — stops resume-saving
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel
@onready var settings_panel := $HUD/SettingsPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	# Resume a saved game if the menu's Continue was tapped; otherwise deal fresh.
	if GameState.resume_requested and load_game():
		GameState.resume_requested = false
	else:
		GameState.resume_requested = false
		deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)
	# Keep the score below the notch / Dynamic Island on real devices.
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)
	# Settings overlay: reflect saved prefs, and persist on every toggle.
	var sound_check := settings_panel.get_node("CenterContainer/VBox/SoundCheck")
	var haptics_check := settings_panel.get_node("CenterContainer/VBox/HapticsCheck")
	sound_check.button_pressed = GameState.sound_on
	haptics_check.button_pressed = GameState.haptics_on
	sound_check.toggled.connect(func(on): GameState.sound_on = on; GameState.save())
	haptics_check.toggled.connect(func(on): GameState.haptics_on = on; GameState.save())
	# Reduce Motion toggle is optional — only wire it if the scene has the node.
	var motion_check := settings_panel.get_node_or_null("CenterContainer/VBox/MotionCheck")
	if motion_check:
		motion_check.button_pressed = GameState.reduce_motion
		motion_check.toggled.connect(func(on): GameState.reduce_motion = on; GameState.save())
	settings_panel.get_node("CenterContainer/VBox/Close").pressed.connect(func(): settings_panel.visible = false)
	# The guide never provides a way to open the settings overlay — add one on the pause menu.
	pause_panel.get_node("CenterContainer/VBoxContainer/Settings").pressed.connect(_on_settings)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	if GameState.reduce_motion:
		return                    # skip shake entirely for motion-sensitive players
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)
	if GameState.haptics_on:
		Input.vibrate_handheld(40)   # ~40ms buzz on a clear (real device only)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	_over = true
	_clear_saved_game()         # a finished game must not resume
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	_over = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")

func _on_settings() -> void:
	settings_panel.visible = true

# --- Resume a saved game (Chapter 31) ---
func _tray_to_data() -> Array:
	var out: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			var cell_list: Array = []
			for c in p.cells:
				cell_list.append([c.x, c.y])
			out.append({ "cells": cell_list, "color": p.color.to_html() })
		else:
			out.append(null)
	return out

func save_game() -> void:
	if _over:
		return                          # don't persist a finished game
	var data := {
		"score": GameState.score,
		"board": $Board.to_data(),
		"tray": _tray_to_data(),
	}
	var f := FileAccess.open(GAME_SAVE, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))
		f.close()

func has_saved_game() -> bool:
	return FileAccess.file_exists(GAME_SAVE)

func _clear_saved_game() -> void:
	if FileAccess.file_exists(GAME_SAVE):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(GAME_SAVE))

func load_game() -> bool:
	if not has_saved_game():
		return false
	var f := FileAccess.open(GAME_SAVE, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) != TYPE_DICTIONARY:
		return false
	GameState.score = int(data.get("score", 0))
	$Board.from_data(data.get("board", []))
	_restore_tray(data.get("tray", []))
	_update_score_label()
	return true

# Rebuild the on-screen tray pieces from saved data — the guide references
# _restore_tray() but never defines it, so this mirrors deal_tray() from data.
func _restore_tray(saved: Array) -> void:
	for i in range(3):
		_free_slot(i)
	for i in range(min(3, saved.size())):
		var entry = saved[i]
		if entry == null:
			continue
		var cells: Array = []
		for c in entry.get("cells", []):
			cells.append(Vector2i(int(c[0]), int(c[1])))
		var color := Color.html(entry.get("color", "ffffff"))
		var piece: Piece = piece_scene.instantiate()
		piece.setup({ "cells": cells, "color": color }, TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save_game()
` },
  ],
};
