import { Types } from "mongoose";
import { InstanceType } from "typegoose";
import { bookingModel, BookingSchema } from "../../../models/Booking";
import { GuestModel } from "../../../models/Guest";
import { extractbooking } from "../../../models/merge/merge";
import {
    UpdateBookingMutationArgs,
    UpdateBookingResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { removeUndefined } from "../../../utils/objFuncs";
import { privateResolver } from "../../../utils/privateResolvers";

const resolvers: Resolvers = {
    Mutation: {
        UpdateBooking: privateResolver(
            async (
                __,
                { bookingId, params }: UpdateBookingMutationArgs
            ): Promise<UpdateBookingResponse> => {
                try {
                    let bookingInstance: InstanceType<
                        BookingSchema
                    > | null = null;
                    await bookingModel.findOneAndUpdate(
                        { _id: new Types.ObjectId(bookingId) },
                        {
                            $set: { ...params }
                        },
                        { new: true },
                        (err, doc) => {
                            console.log({
                                ...doc
                            });
                            bookingInstance = doc;
                        }
                    );
                    if (params.name || params.bookingStatus) {
                        await GuestModel.updateMany(
                            {
                                booking: new Types.ObjectId(bookingId)
                            },
                            {
                                $set: removeUndefined({
                                    name: params.name,
                                    bookingStatus: params.bookingStatus
                                })
                            }
                        );
                    }

                    return {
                        ok: true,
                        error: null,
                        booking:
                            bookingInstance &&
                            (await extractbooking.bind(
                                extractbooking,
                                bookingInstance
                            ))
                    };
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        booking: null
                    };
                }
            }
        )
    }
};
export default resolvers;