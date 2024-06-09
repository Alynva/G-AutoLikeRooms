import gearth from './services/gearth.mjs'

gearth.onRoomChange(() => {
	gearth.giveLikeToRoom()
})
