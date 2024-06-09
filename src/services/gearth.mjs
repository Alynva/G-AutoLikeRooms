import { Extension, HPacket, HDirection } from 'gnode-api'

const ext = new Extension({
	author: 'Alynva',
	description: 'Automatically give a like in all rooms you visit.',
	name: "G-AutoLikeRooms",
	version: "1.0.0",
})

ext.run()

ext.on('connect', async () => {
	ext.writeToConsole(`G-AutoLikeRooms ready.`)
})

ext.interceptByNameOrHash(HDirection.TOCLIENT, "GetGuestRoomResult", message => {
	const entrance = message.getPacket().readBoolean()

	if (!entrance) return

	for (const handler of onRoomChangeHandlers) {
		if (typeof handler !== 'function') continue

		handler()
	}
})

/**
 * @param {HDirection} direction
 * @param {HPacket} packet
 */
function safeSend(direction, packet) {
	try {
		if (typeof packet === 'string')
			packet = new HPacket(packet)

		if (direction === HDirection.TOCLIENT) ext.sendToClient(packet)
		if (direction === HDirection.TOSERVER) ext.sendToServer(packet)

		return true
	} catch (e) {
		console.error(e)
		console.error(`Couldn't send this packet:`, packet)
	}
}

const onRoomChangeHandlers = []
function onRoomChange(handler) {
	onRoomChangeHandlers.push(handler)
}

function giveLikeToRoom() {
	safeSend(HDirection.TOSERVER, new HPacket(`{out:RateFlat}{i:1}`))
}

export default {
	onRoomChange,
	giveLikeToRoom,
}
