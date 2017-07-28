<template>
  <div style="width:100%; height:100%;">
    <canvas ref="canvas" :width="width" :height="height">
      <particle v-for="(particle,index) in particles" :key="index" ref="particle" :position-x.sync="particle.positionX" :position-y.sync="particle.positionY" :radius.sync="particle.radius" :stackPos="index"></particle>
    </canvas>
  </div>
</template>


<script>
  import Particle from './Particle'
  import { requestAnimationFrame, cancelAnimationFrame } from './RAF'

  export default {
    name: 'VParticleground',

    components: {
      Particle
    },

    props: {
      paused: {
        type: Boolean,
        default: false
      },

      minSpeedX: {
        type: Number,
        default: 0.1
      },

      maxSpeedX: {
        type: Number,
        default: 0.7
      },

      minSpeedY: {
        type: Number,
        default: 0.1
      },

      maxSpeedY: {
        type: Number,
        default: 0.7
      },

      directionX: {
        type: String,
        default: 'center'
      },

      directionY: {
        type: String,
        default: 'center'
      },

      density: {
        type: Number,
        default: 10000
      },

      dotColor: {
        type: String,
        default: '#666666'
      },

      lineColor: {
        type: String,
        default: '#666666'
      },

      maxRadius: {
        type: Number,
        default: 20
      },

      minRadius: {
        type: Number,
        default: 7
      },

      lineWidth: {
        type: Number,
        default: 1
      },

      curvedLines: {
        type: Boolean,
        default: false
      },

      proximity: {
        type: Number,
        default: 100
      },

      parallax: {
        type: Boolean,
        default: true
      },

      parallaxMultiplier: {
        type: Number,
        default: 5
      }
    },

    data () {
      return {
        width: 0,
        height: 0,
        particles: [],
        canvasSupport: !!document.createElement('canvas').getContext,
        orientationSupport: !!window.DeviceOrientationEvent,
        desktop: !window.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i),
        mouseX: 0,
        mouseY: 0,
        tiltX: 0,
        tiltY: 0
      }
    },

    computed: {
      pointerX () {
        if (this.orientationSupport && !this.desktop) {
          const ratioX = (this.width - 0) / (30 - -30)
          return (this.tiltX - -30) * ratioX + 0
        } else {
          return this.mouseX
        }
      },
      pointerY () {
        if (this.orientationSupport && !this.desktop) {
          const ratioY = (this.height - 0) / (30 - -30)
          return (this.tiltY - -30) * ratioY + 0
        } else {
          return this.mouseY
        }
      },

      numParticles () {
        return Math.round((this.width * this.height) / this.density)
      }
    },

    watch: {
      paused (val) {
        !val && this.draw()
      },

      'numParticles': 'numChange',
      'width': 'sizeChange',
      'height': 'sizeChange'
    },

    created () {
      if (this.orientationSupport && !this.desktop) {
        window.addEventListener('deviceorientation', event => {
          this.tiltY = Math.min(Math.max(-event.beta, -30), 30)
          this.tiltX = Math.min(Math.max(-event.gamma, -30), 30)
        }, true)
      }
    },

    mounted () {
      this.resize()
      this.init()
      window.addEventListener('resize', this.resize, false)
      this.$refs.canvas.addEventListener('mousemove', e => {
        this.mouseX = e.offsetX
        this.mouseY = e.offsetY
      }, false)
      this.draw()
    },

    methods: {
      init () {
        this.ctx = this.$refs.canvas.getContext('2d')
        this.particles = Array.apply(null, { length: this.numParticles }).map(item => {
          return {
            positionX: null,
            positionY: null,
            radius: 0
          }
        })
      },

      resize () {
        this.width = this.$el.clientWidth
        this.height = this.$el.clientHeight
      },

      draw () {
        if (!this.canvasSupport) {
          return
        }

        this.ctx.clearRect(0, 0, this.width, this.height)

        if (this.$refs['particle']) {
          this.$refs['particle'].forEach(ref => {
            ref.updatePosition()
          })

          this.drawParticles()
        }
        if (!this.paused) {
          this.raf = requestAnimationFrame(this.draw)
        }
      },

      drawParticles () {
        const { ctx } = this
        for (let i = 0; this.particles[i]; i++) {
          const item = this.particles[i]
          ctx.beginPath()
          ctx.arc(item.positionX + this.$refs['particle'][i].parallaxOffsetX, item.positionY + this.$refs['particle'][i].parallaxOffsetY, item.radius / 2, 0, Math.PI * 2, true)
          ctx.closePath()
          ctx.fill()
        }
      },

      numChange () {
        if (this.numParticles >= this.particles.length) {
          while (this.numParticles > this.particles.length) {
            this.particles.push({
              positionX: null,
              positionY: null,
              radius: 0
            })
          }
        } else {
          this.particles.splice(this.numParticles)
        }
      },

      sizeChange () {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          let particle = this.particles[i]
          if (particle.positionX > this.width || particle.positionY > this.height) {
            this.particles.splice(i, 1)
          }
        }
      }
    },

    updated () {
      this.ctx.fillStyle = this.dotColor
      this.ctx.strokeStyle = this.lineColor
      this.ctx.lineWidth = this.lineWidth
    },

    destroy () {
      cancelAnimationFrame(this.raf)
      window.removeEventListener('resize', this.resize)
    }
  }
</script>
