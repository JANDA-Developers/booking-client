import { Types } from "mongoose";
import { GuestModel } from "../../../models/Guest";
import { extractGuest } from "../../../models/merge/merge";
import { RoomModel } from "../../../models/Room";
import {
    AllocateGuestToRoomMutationArgs,
    AllocateGuestToRoomResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { privateResolver } from "../../../utils/privateResolvers";

const resolvers: Resolvers = {
    Mutation: {
        AllocateGuestToRoom: privateResolver(
            async (
                _,
                { guestId, roomId }: AllocateGuestToRoomMutationArgs
            ): Promise<AllocateGuestToRoomResponse> => {
                try {
                    const existingGuest = await GuestModel.findById(guestId);
                    if (!existingGuest) {
                        return {
                            ok: false,
                            error: "게스트가 존재하지 않습니다",
                            guest: null
                        };
                    }
                    const existingRoom = await RoomModel.findById(roomId);
                    if (!existingRoom) {
                        return {
                            ok: false,
                            error: "방이 존재하지 않습니다",
                            guest: await extractGuest.bind(
                                extractGuest,
                                existingGuest
                            )
                        };
                    }
                    existingGuest.allocatedRoom = new Types.ObjectId(roomId);
                    await existingGuest.save();
                    return {
                        ok: false,
                        error: null,
                        guest: await extractGuest.bind(
                            extractGuest,
                            existingGuest
                        )
                    };
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        guest: null
                    };
                }
            }
        )
    }
};
export default resolvers;
