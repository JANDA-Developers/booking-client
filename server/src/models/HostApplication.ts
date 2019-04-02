import { prop, Ref, Typegoose } from "typegoose";
import { HostApplicationAdminSchema } from "./HostApplicationAdmin";
import { HouseSchema } from "./House";
import { UserSchema } from "./User";

export class HostApplicationSchema extends Typegoose {
    @prop({ ref: HouseSchema, required: true })
    house: Ref<HouseSchema>;

    @prop({ ref: UserSchema, required: true })
    user: Ref<UserSchema>;

    @prop({ required: true })
    url: string;

    @prop({ ref: HostApplicationAdminSchema })
    hostWebAdmin: Ref<HostApplicationAdminSchema>;

    @prop()
    description: string;

    @prop()
    createdAt: Date;

    @prop()
    updatedAt: Date;
}

export const HostApplicationModel = new HostApplicationSchema().getModelForClass(
    HostApplicationSchema,
    {
        schemaOptions: {
            timestamps: true,
            collection: "HostWebs"
        }
    }
);