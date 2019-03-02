import { InstanceType } from "typegoose";
import { extractRoomType } from "../../../models/Merge";
import { RoomTypeSchema } from "../../../models/RoomType";
import {
    UpdateRoomTypeMutationArgs,
    UpdateRoomTypeResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { privateRoomTypeExistCheckResolver } from "../../../utils/privateResolvers";

/**
 * UpdateRoomType: 방 타입 업데이트
 * ChangeIndex: 방 정렬번호 변경
 */
const resolver: Resolvers = {
    Mutation: {
        UpdateRoomType: privateRoomTypeExistCheckResolver(
            async (
                _,
                args: UpdateRoomTypeMutationArgs,
                context
            ): Promise<UpdateRoomTypeResponse> => {
                try {
                    const existingRoomType: InstanceType<RoomTypeSchema> =
                        context.existingRoomType;
                    if (existingRoomType) {
                        await existingRoomType.update(
                            { ...args },
                            {
                                new: true
                            }
                        );
                        const roomType = await extractRoomType(
                            existingRoomType
                        );
                        return {
                            ok: true,
                            error: null,
                            roomType: {
                                ...roomType
                            }
                        };
                    } else {
                        return {
                            ok: false,
                            error: "Invalid RoomTypeId",
                            roomType: null
                        };
                    }
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        roomType: null
                    };
                }
            }
        )
    }
};

export default resolver;
