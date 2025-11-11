/**
 * 2D Worm Game - Zelda-style top-down movement
 * Control the worm with QZSD keys in a 2D world
 */

interface Point {
  x: number
  y: number
}

interface WormSegment extends Point {
  direction: number // Current direction in radians
}

interface Laser {
  x: number
  y: number
  direction: number
  speed: number
  active: boolean
}

interface Hedgehog {
  x: number
  y: number
  hp: number // Health points (2 to kill)
  speed: number
  direction: number
}

interface BloodParticle {
  x: number
  y: number
  vx: number // Velocity X
  vy: number // Velocity Y
  age: number // Time alive in frames
  maxAge: number
}

interface Leaf {
  x: number
  y: number
}

interface GameState {
  worm: {
    segments: WormSegment[]
    direction: number // Current movement direction (0=right, Math.PI/2=down, Math.PI=left, -Math.PI/2=up)
    speed: number
    segmentSize: number
    segmentSpacing: number
  }
  world: {
    width: number
    height: number
    tileSize: number
  }
  keys: {
    q: boolean // Left (AZERTY)
    z: boolean // Up (AZERTY)
    s: boolean // Down (AZERTY)
    d: boolean // Right (AZERTY)
    space: boolean // Shoot laser
  }
  lasers: Laser[]
  hedgehogs: Hedgehog[]
  leaves: Leaf[]
  bloodParticles: BloodParticle[]
  segmentsLost: number
  gameOver: boolean
  camera: {
    x: number
    y: number
  }
}

export function setupWorm(container: HTMLDivElement): void {
  // Create and configure canvas
  const canvas = document.createElement('canvas')
  canvas.id = 'worm-canvas'
  canvas.width = 800
  canvas.height = 600
  container.appendChild(canvas)

  const ctx = canvas.getContext('2d')!
  if (!ctx) {
    console.error('Failed to get 2D context')
    return
  }

  // Initialize game state
  const SEGMENT_COUNT = 10
  const TILE_SIZE = 32
  const WORLD_WIDTH = 50 // tiles
  const WORLD_HEIGHT = 40 // tiles

  const gameState: GameState = {
    worm: {
      segments: [],
      direction: 0, // Start facing right
      speed: 2,
      segmentSize: 12,
      segmentSpacing: 16
    },
    world: {
      width: WORLD_WIDTH * TILE_SIZE,
      height: WORLD_HEIGHT * TILE_SIZE,
      tileSize: TILE_SIZE
    },
    keys: {
      q: false,
      z: false,
      s: false,
      d: false,
      space: false
    },
    lasers: [],
    hedgehogs: [],
    leaves: [],
    bloodParticles: [],
    segmentsLost: 0,
    gameOver: false,
    camera: {
      x: 0,
      y: 0
    }
  }

  // Initialize worm segments in the center of the world
  const startX = (WORLD_WIDTH * TILE_SIZE) / 2
  const startY = (WORLD_HEIGHT * TILE_SIZE) / 2

  for (let i = 0; i < SEGMENT_COUNT; i++) {
    gameState.worm.segments.push({
      x: startX - i * gameState.worm.segmentSpacing,
      y: startY,
      direction: 0
    })
  }

  // Spawn initial hedgehogs
  function spawnHedgehog(): void {
    const margin = 100 // Keep away from edges
    const x = margin + Math.random() * (gameState.world.width - 2 * margin)
    const y = margin + Math.random() * (gameState.world.height - 2 * margin)

    // Don't spawn too close to the worm
    const head = gameState.worm.segments[0]
    const dx = x - head.x
    const dy = y - head.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 200) { // Minimum safe distance
      gameState.hedgehogs.push({
        x,
        y,
        hp: 2,
        speed: 1,
        direction: 0
      })
    }
  }

  // Spawn initial hedgehogs
  for (let i = 0; i < 3; i++) {
    spawnHedgehog()
  }

  // Spawn hedgehogs periodically
  let hedgehogSpawnTimer = 0
  const HEDGEHOG_SPAWN_INTERVAL = 300 // frames (~5 seconds at 60fps)

  // Spawn initial leaves
  function spawnLeaf(): void {
    const margin = 50
    const x = margin + Math.random() * (gameState.world.width - 2 * margin)
    const y = margin + Math.random() * (gameState.world.height - 2 * margin)
    gameState.leaves.push({ x, y })
  }

  // Spawn initial leaves
  for (let i = 0; i < 5; i++) {
    spawnLeaf()
  }

  // Keyboard input handling
  let lastShootTime = 0
  const SHOOT_COOLDOWN = 200 // milliseconds

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    if (key === 'q') gameState.keys.q = true
    if (key === 'z') gameState.keys.z = true
    if (key === 's') gameState.keys.s = true
    if (key === 'd') gameState.keys.d = true
    if (key === ' ') {
      const now = Date.now()
      if (now - lastShootTime > SHOOT_COOLDOWN) {
        gameState.keys.space = true
        lastShootTime = now
      }
    }
  })

  document.addEventListener('keyup', (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    if (key === 'q') gameState.keys.q = false
    if (key === 'z') gameState.keys.z = false
    if (key === 's') gameState.keys.s = false
    if (key === 'd') gameState.keys.d = false
    if (key === ' ') gameState.keys.space = false
  })

  // Update game logic
  function update(): void {
    const worm = gameState.worm
    const head = worm.segments[0]

    // Determine movement direction based on keyboard input
    let moving = false
    let targetDirection = worm.direction

    if (gameState.keys.d) {
      targetDirection = 0 // Right
      moving = true
    } else if (gameState.keys.q) {
      targetDirection = Math.PI // Left
      moving = true
    }

    if (gameState.keys.z) {
      targetDirection = -Math.PI / 2 // Up
      moving = true
    } else if (gameState.keys.s) {
      targetDirection = Math.PI / 2 // Down
      moving = true
    }

    // Handle diagonal movement
    if (gameState.keys.d && gameState.keys.z) {
      targetDirection = -Math.PI / 4 // Up-Right
    } else if (gameState.keys.d && gameState.keys.s) {
      targetDirection = Math.PI / 4 // Down-Right
    } else if (gameState.keys.q && gameState.keys.z) {
      targetDirection = -3 * Math.PI / 4 // Up-Left
    } else if (gameState.keys.q && gameState.keys.s) {
      targetDirection = 3 * Math.PI / 4 // Down-Left
    }

    if (moving) {
      worm.direction = targetDirection

      // Calculate new head position
      const newX = head.x + Math.cos(worm.direction) * worm.speed
      const newY = head.y + Math.sin(worm.direction) * worm.speed

      // Boundary collision - keep worm in world
      const clampedX = Math.max(worm.segmentSize, Math.min(gameState.world.width - worm.segmentSize, newX))
      const clampedY = Math.max(worm.segmentSize, Math.min(gameState.world.height - worm.segmentSize, newY))

      // Move segments - each follows the previous one
      for (let i = worm.segments.length - 1; i > 0; i--) {
        const segment = worm.segments[i]
        const previous = worm.segments[i - 1]

        // Calculate direction to previous segment
        const dx = previous.x - segment.x
        const dy = previous.y - segment.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > worm.segmentSpacing) {
          // Move toward previous segment
          segment.x += (dx / distance) * worm.speed
          segment.y += (dy / distance) * worm.speed
          segment.direction = Math.atan2(dy, dx)
        }
      }

      // Update head position
      head.x = clampedX
      head.y = clampedY
      head.direction = worm.direction
    }

    // Shoot laser
    if (gameState.keys.space) {
      gameState.lasers.push({
        x: head.x,
        y: head.y,
        direction: worm.direction,
        speed: 8,
        active: true
      })
      gameState.keys.space = false // Reset to prevent continuous shooting
    }

    // Update lasers
    for (let i = gameState.lasers.length - 1; i >= 0; i--) {
      const laser = gameState.lasers[i]

      // Move laser
      laser.x += Math.cos(laser.direction) * laser.speed
      laser.y += Math.sin(laser.direction) * laser.speed

      // Check if laser is out of bounds
      if (laser.x < 0 || laser.x > gameState.world.width ||
          laser.y < 0 || laser.y > gameState.world.height) {
        gameState.lasers.splice(i, 1)
      }
    }

    // Update hedgehogs (AI - chase the worm)
    for (const hedgehog of gameState.hedgehogs) {
      const dx = head.x - hedgehog.x
      const dy = head.y - hedgehog.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 0) {
        // Move toward worm
        hedgehog.x += (dx / distance) * hedgehog.speed
        hedgehog.y += (dy / distance) * hedgehog.speed
        hedgehog.direction = Math.atan2(dy, dx)
      }
    }

    // Spawn new hedgehogs periodically
    hedgehogSpawnTimer++
    if (hedgehogSpawnTimer >= HEDGEHOG_SPAWN_INTERVAL) {
      hedgehogSpawnTimer = 0
      if (gameState.hedgehogs.length < 8) { // Max 8 hedgehogs at once
        spawnHedgehog()
      }
    }

    // Update blood particles
    for (let i = gameState.bloodParticles.length - 1; i >= 0; i--) {
      const particle = gameState.bloodParticles[i]
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.2 // Gravity
      particle.age++

      // Remove old particles
      if (particle.age >= particle.maxAge) {
        gameState.bloodParticles.splice(i, 1)
      }
    }

    // Collision detection: Laser vs Hedgehogs
    for (let i = gameState.lasers.length - 1; i >= 0; i--) {
      const laser = gameState.lasers[i]

      for (let j = gameState.hedgehogs.length - 1; j >= 0; j--) {
        const hedgehog = gameState.hedgehogs[j]
        const dx = laser.x - hedgehog.x
        const dy = laser.y - hedgehog.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 20) { // Collision radius
          // Hit hedgehog
          hedgehog.hp--
          gameState.lasers.splice(i, 1) // Remove laser

          // If hedgehog is dead, remove it
          if (hedgehog.hp <= 0) {
            gameState.hedgehogs.splice(j, 1)
            // Spawn a new leaf when hedgehog dies
            spawnLeaf()
          }
          break
        }
      }
    }

    // Collision detection: Worm vs Hedgehogs (lose segments)
    for (let i = gameState.hedgehogs.length - 1; i >= 0; i--) {
      const hedgehog = gameState.hedgehogs[i]
      const dx = head.x - hedgehog.x
      const dy = head.y - hedgehog.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < worm.segmentSize + 15) { // Collision with head
        // Worm loses a segment
        if (worm.segments.length > 1) {
          const lostSegment = worm.segments.pop()!
          gameState.segmentsLost++

          // Spawn blood particles
          const particleCount = 5 + gameState.segmentsLost * 2 // More blood with more damage
          for (let p = 0; p < particleCount; p++) {
            gameState.bloodParticles.push({
              x: lostSegment.x,
              y: lostSegment.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4 - 2,
              age: 0,
              maxAge: 30 + Math.random() * 20
            })
          }

          // Remove hedgehog after it damages worm
          gameState.hedgehogs.splice(i, 1)

          // Check for game over
          if (gameState.segmentsLost >= 4) {
            gameState.gameOver = true
          }
        }
      }
    }

    // Collision detection: Worm vs Leaves (gain segment)
    for (let i = gameState.leaves.length - 1; i >= 0; i--) {
      const leaf = gameState.leaves[i]
      const dx = head.x - leaf.x
      const dy = head.y - leaf.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < worm.segmentSize + 10) { // Collision
        // Add a new segment at the tail
        const tail = worm.segments[worm.segments.length - 1]
        worm.segments.push({
          x: tail.x,
          y: tail.y,
          direction: tail.direction
        })

        // Remove leaf
        gameState.leaves.splice(i, 1)

        // Spawn a new leaf elsewhere
        spawnLeaf()

        // Reduce segments lost counter if any
        if (gameState.segmentsLost > 0) {
          gameState.segmentsLost--
        }
      }
    }

    // Handle game over
    if (gameState.gameOver) {
      // Reset game state
      gameState.worm.segments = []
      for (let i = 0; i < SEGMENT_COUNT; i++) {
        gameState.worm.segments.push({
          x: startX - i * gameState.worm.segmentSpacing,
          y: startY,
          direction: 0
        })
      }
      gameState.hedgehogs = []
      gameState.leaves = []
      gameState.bloodParticles = []
      gameState.segmentsLost = 0
      gameState.gameOver = false

      // Respawn initial entities
      for (let i = 0; i < 3; i++) {
        spawnHedgehog()
      }
      for (let i = 0; i < 5; i++) {
        spawnLeaf()
      }
    }

    // Update camera to follow worm (centered on head)
    gameState.camera.x = head.x - canvas.width / 2
    gameState.camera.y = head.y - canvas.height / 2

    // Clamp camera to world bounds
    gameState.camera.x = Math.max(0, Math.min(gameState.world.width - canvas.width, gameState.camera.x))
    gameState.camera.y = Math.max(0, Math.min(gameState.world.height - canvas.height, gameState.camera.y))
  }

  // Render the game world
  function render(): void {
    // Clear canvas
    ctx.fillStyle = '#2a4a2a' // Dark green background (grass)
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Save context for camera transform
    ctx.save()
    ctx.translate(-gameState.camera.x, -gameState.camera.y)

    // Draw world grid (grass tiles)
    const startTileX = Math.floor(gameState.camera.x / gameState.world.tileSize)
    const endTileX = Math.ceil((gameState.camera.x + canvas.width) / gameState.world.tileSize)
    const startTileY = Math.floor(gameState.camera.y / gameState.world.tileSize)
    const endTileY = Math.ceil((gameState.camera.y + canvas.height) / gameState.world.tileSize)

    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        const x = tx * gameState.world.tileSize
        const y = ty * gameState.world.tileSize

        // Checkerboard pattern for grass
        if ((tx + ty) % 2 === 0) {
          ctx.fillStyle = '#3a5a3a'
        } else {
          ctx.fillStyle = '#2a4a2a'
        }
        ctx.fillRect(x, y, gameState.world.tileSize, gameState.world.tileSize)

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, gameState.world.tileSize, gameState.world.tileSize)
      }
    }

    // Draw world boundaries
    ctx.strokeStyle = '#646cff'
    ctx.lineWidth = 4
    ctx.strokeRect(0, 0, gameState.world.width, gameState.world.height)

    // Draw worm body (connections between segments)
    const worm = gameState.worm
    ctx.strokeStyle = '#8888ff'
    ctx.lineWidth = worm.segmentSize * 1.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(worm.segments[0].x, worm.segments[0].y)
    for (let i = 1; i < worm.segments.length; i++) {
      ctx.lineTo(worm.segments[i].x, worm.segments[i].y)
    }
    ctx.stroke()

    // Draw worm segments
    for (let i = 0; i < worm.segments.length; i++) {
      const segment = worm.segments[i]
      const isHead = i === 0

      // Segment gradient
      const gradient = ctx.createRadialGradient(
        segment.x, segment.y, 0,
        segment.x, segment.y, worm.segmentSize
      )

      const brightness = 1 - (i / worm.segments.length) * 0.5
      gradient.addColorStop(0, `rgba(100, 108, 255, ${brightness})`)
      gradient.addColorStop(1, `rgba(100, 108, 255, ${brightness * 0.5})`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(segment.x, segment.y, worm.segmentSize, 0, Math.PI * 2)
      ctx.fill()

      // Draw head details
      if (isHead) {
        // Eyes
        const eyeOffset = worm.segmentSize * 0.4
        const eyeSize = worm.segmentSize * 0.25

        const eye1X = segment.x + Math.cos(segment.direction + Math.PI / 4) * eyeOffset
        const eye1Y = segment.y + Math.sin(segment.direction + Math.PI / 4) * eyeOffset
        const eye2X = segment.x + Math.cos(segment.direction - Math.PI / 4) * eyeOffset
        const eye2Y = segment.y + Math.sin(segment.direction - Math.PI / 4) * eyeOffset

        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2)
        ctx.fill()

        // Pupils
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(eye1X, eye1Y, eyeSize * 0.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(eye2X, eye2Y, eyeSize * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw lasers
    for (const laser of gameState.lasers) {
      // Laser glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = '#ff0000'

      // Laser body (red beam)
      ctx.strokeStyle = '#ff3333'
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath()

      const laserLength = 20
      const startX = laser.x - Math.cos(laser.direction) * laserLength / 2
      const startY = laser.y - Math.sin(laser.direction) * laserLength / 2
      const endX = laser.x + Math.cos(laser.direction) * laserLength / 2
      const endY = laser.y + Math.sin(laser.direction) * laserLength / 2

      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Inner bright core
      ctx.strokeStyle = '#ffaaaa'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Reset shadow
      ctx.shadowBlur = 0
    }

    // Draw blood particles
    for (const particle of gameState.bloodParticles) {
      const alpha = 1 - (particle.age / particle.maxAge)
      ctx.fillStyle = `rgba(139, 0, 0, ${alpha})` // Dark red blood
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw leaves
    for (const leaf of gameState.leaves) {
      // Leaf shape (green)
      ctx.fillStyle = '#2ecc71'
      ctx.beginPath()
      ctx.ellipse(leaf.x, leaf.y, 12, 8, Math.PI / 4, 0, Math.PI * 2)
      ctx.fill()

      // Leaf vein
      ctx.strokeStyle = '#27ae60'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(leaf.x - 8, leaf.y - 5)
      ctx.lineTo(leaf.x + 8, leaf.y + 5)
      ctx.stroke()
    }

    // Draw hedgehogs
    for (const hedgehog of gameState.hedgehogs) {
      // Body (brown circle)
      ctx.fillStyle = '#8b4513'
      ctx.beginPath()
      ctx.arc(hedgehog.x, hedgehog.y, 15, 0, Math.PI * 2)
      ctx.fill()

      // Spikes (darker brown)
      ctx.fillStyle = '#654321'
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const spikeX = hedgehog.x + Math.cos(angle) * 15
        const spikeY = hedgehog.y + Math.sin(angle) * 15
        const tipX = hedgehog.x + Math.cos(angle) * 22
        const tipY = hedgehog.y + Math.sin(angle) * 22

        ctx.beginPath()
        ctx.moveTo(spikeX, spikeY)
        ctx.lineTo(tipX, tipY)
        ctx.lineTo(spikeX + Math.cos(angle + 0.3) * 7, spikeY + Math.sin(angle + 0.3) * 7)
        ctx.closePath()
        ctx.fill()
      }

      // Face (toward worm)
      const faceX = hedgehog.x + Math.cos(hedgehog.direction) * 12
      const faceY = hedgehog.y + Math.sin(hedgehog.direction) * 12

      // Nose (black)
      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc(faceX, faceY, 3, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      const eyeOffset = 5
      const eye1X = faceX + Math.cos(hedgehog.direction + Math.PI / 3) * eyeOffset
      const eye1Y = faceY + Math.sin(hedgehog.direction + Math.PI / 3) * eyeOffset
      const eye2X = faceX + Math.cos(hedgehog.direction - Math.PI / 3) * eyeOffset
      const eye2Y = faceY + Math.sin(hedgehog.direction - Math.PI / 3) * eyeOffset

      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc(eye1X, eye1Y, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(eye2X, eye2Y, 2, 0, Math.PI * 2)
      ctx.fill()

      // HP indicator (red bar if damaged)
      if (hedgehog.hp < 2) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'
        ctx.fillRect(hedgehog.x - 15, hedgehog.y - 25, 30 * (hedgehog.hp / 2), 3)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1
        ctx.strokeRect(hedgehog.x - 15, hedgehog.y - 25, 30, 3)
      }
    }

    ctx.restore()

    // Draw UI overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(10, 10, 250, 140)
    ctx.fillStyle = 'white'
    ctx.font = '14px monospace'
    const head = worm.segments[0]
    ctx.fillText(`Position: (${Math.floor(head.x)}, ${Math.floor(head.y)})`, 20, 30)
    ctx.fillText(`Segments: ${worm.segments.length}`, 20, 50)
    ctx.fillText(`Damage taken: ${gameState.segmentsLost}/4`, 20, 70)

    // Health bar
    const healthPercent = 1 - (gameState.segmentsLost / 4)
    ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c'
    ctx.fillRect(20, 80, 210 * healthPercent, 15)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 80, 210, 15)

    ctx.fillStyle = 'white'
    ctx.fillText(`Move: Q Z S D`, 20, 115)
    ctx.fillText(`Shoot: SPACE`, 20, 135)
  }

  // Game loop
  function gameLoop(): void {
    update()
    render()
    requestAnimationFrame(gameLoop)
  }

  // Start the game
  gameLoop()
}
