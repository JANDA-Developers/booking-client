export const typeDefs = ["type Booking {\n  _id: ID!\n  house: House!\n  booker: User!\n  roomTypes: [RoomType!]!\n  dateRange: DateRange!\n  price: Float!\n  bookingStatus: BookingStatus!\n  guests: [String!]\n  memo: String!\n}\n\nenum BookingStatus {\n  WAIT_DEPOSIT\n  COMPLETE\n  CANCEL\n  REFUND_WAIT\n  PAY_WHEN_CHK_IN\n}\n\nscalar Date\n\nscalar DateTime\n\nscalar EmailAddress\n\nscalar Name\n\nscalar Password\n\nscalar PhoneNumber\n\nscalar URL\n\n# DB에 저장할 떄는 0101010의 형태로 저장하도록 Resolver에서 처리한다.\nenum Day {\n  SUN\n  # BackEndog!\n  MON\n  TUE\n  WED\n  THU\n  FRI\n  SAT\n}\n\ntype Location {\n  address: String!\n  lat: Float!\n  lng: Float!\n}\n\ninput LocationInput {\n  address: String!\n  lat: Float!\n  lng: Float!\n}\n\ntype DateRange {\n  startDate: String!\n  endDate: String!\n  isPast: Boolean!\n}\n\ninput DateRangeInput {\n  startDate: String!\n  endDate: String!\n}\n\ntype Tag {\n  name: String!\n  content: String!\n  icon: String!\n}\n\ninput TagInput {\n  name: String!\n  content: String!\n  icon: String\n}\n\ntype Guest {\n  _id: ID!\n  house: House!\n  booker: User!\n  roomType: String!\n  guestType: String!\n  allocatedRoom: Room!\n  stay: String!\n  price: Int!\n  isChkIn: Boolean!\n  bookingId: String!\n  createdAt: String!\n  updatedAt: String\n}\n\ntype CreateHouseResponse {\n  ok: Boolean!\n  error: String\n  house: House\n}\n\ntype Mutation {\n  CreateHouse(name: String!, houseType: HouseType!, location: LocationInput!): CreateHouseResponse!\n  DeleteHouse(_id: String!): DeleteHouseResponse!\n  UpdateHouse(houseId: ID!, name: String, houseType: HouseType, location: LocationInput, refundPolicy: [TermsOfRefundInput!], termsOfBooking: TermsOfBookingInput): UpdateHouseResponse!\n  # 로그인 token 필요함!\n  CreateRoomType(name: String!, house: String!, pricingType: PricingType!, peopleCount: Int!, peopleCountMax: Int, isEnable: Boolean!, description: String, tags: [TagInput!]): CreateRoomTypeResponse!\n  DeleteRoomType(roomTypeId: String!): DeleteRoomTypeResponse!\n  UpdateRoomType(roomTypeId: String!, name: String, peopleCount: Int, peopleCountMax: Int, index: Int, isEnable: Boolean, description: String): UpdateRoomTypeResponse!\n  CompletePhoneVerification(key: String!): CompletePhoneVerificationResponse!\n  EmailSignUp(name: String!, email: EmailAddress!, password: Password!, phoneNumber: PhoneNumber!): EmailSignUpResponse!\n  GmailConnect(firstName: String!, lastName: String!, gmail: String!): GmailConnectionResponse!\n  StartPhoneVerification: StartPhoneVerificationResponse!\n  UpdateMyProfile(name: String!, phoneNumber: String!, password: String!): UpdateMyProfileResponse!\n  ChangePassword(currentPassword: String!, newPassword: String!, newPasswordRepeat: String!): ChangePasswordResponse!\n}\n\ntype DeleteHouseResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype House {\n  _id: ID!\n  name: String!\n  houseType: HouseType!\n  user: User!\n  location: Location!\n  refundPolicy: [TermsOfRefund!]!\n  termsOfBooking: TermsOfBooking!\n  createdAt: DateTime!\n  updatedAt: DateTime\n}\n\nenum HouseType {\n  GUEST_HOUSE\n  HOSTEL\n  HOTEL\n  MOTEL\n  PENSION\n  YOUTH_HOSTEL\n}\n\n# 예약 가능한 조건.\ntype TermsOfBooking {\n  # 선택 가능한 가장 멀리있는 날짜(today 를 기준으로 ~일 뒤)\n  farthestSelectableDate: Int!\n  # 선택 가능한 가장 가까히 있는 날짜(today 를 기준으로 ~일 뒤)\n  nearestSelectableDate: Int!\n  # 선택 가능 날짜 범위\n  selectableDateRange: Int!\n}\n\ntype TermsOfRefund {\n  # 환불 가능 기간: 숙박일로부터 ~일 전\n  beforeDays: Int!\n  rate: Float!\n  description: String\n}\n\ninput TermsOfRefundInput {\n  beforeDays: Int!\n  rate: Float!\n  description: String\n}\n\ninput TermsOfBookingInput {\n  # 선택 가능한 가장 멀리있는 날짜(today 를 기준으로 ~일 뒤)\n  farthestSelectableDate: Int!\n  # 선택 가능한 가장 가까히 있는 날짜(today 를 기준으로 ~일 뒤)\n  nearestSelectableDate: Int!\n  # 선택 가능 날짜 범위\n  selectableDateRange: Int!\n}\n\ntype UpdateHouseResponse {\n  ok: Boolean!\n  error: String\n  house: House\n}\n\ntype SeasonPrice {\n  _id: ID!\n  house: House!\n  roomType: RoomType!\n  season: Season!\n  price: Float!\n  applyDays: [Day]!\n}\n\ntype Season {\n  _id: ID!\n  house: House!\n  name: String!\n  dateRange: DateRange!\n  color: String!\n  description: String!\n}\n\ninput SeasonPriceInput {\n  price: Float!\n  applyDays: Int!\n}\n\ntype RoomPrice {\n  _id: ID!\n  house: House!\n  roomType: RoomType!\n  price: Float!\n  date: String!\n}\n\ntype CreateRoomTypeResponse {\n  ok: Boolean!\n  error: String\n  roomType: RoomType\n}\n\ntype DeleteRoomTypeResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype Room {\n  _id: ID!\n  name: String!\n  roomType: RoomType!\n  isEnable: Boolean!\n  createdAt: DateTime\n  updatedAt: DateTime\n}\n\ntype RoomType {\n  _id: ID!\n  name: String!\n  house: House!\n  pricingType: PricingType!\n  peopleCount: Int!\n  peopleCountMax: Int!\n  index: Int!\n  roomCount: Int!\n  isEnable: Boolean!\n  description: String!\n  # 예전에 Facilities 랑 같은 아이임...\n  tags: [Tag!]!\n  rooms: [Room!]!\n  createdAt: String!\n  updatedAt: String\n}\n\nenum PricingType {\n  DOMITORY\n  ROOM\n}\n\ntype UpdateRoomTypeResponse {\n  ok: Boolean!\n  error: String\n  roomType: RoomType\n}\n\ntype CompletePhoneVerificationResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype EmailSignInResponse {\n  ok: Boolean!\n  error: String\n  token: String\n}\n\ntype Query {\n  EmailSignIn(email: String!, password: String!): EmailSignInResponse!\n  # 로그인 token 필요!\n  GetMyProfile: GetMyProfileResponse!\n}\n\ntype EmailSignUpResponse {\n  ok: Boolean!\n  error: String\n  token: String\n}\n\ntype GetMyProfileResponse {\n  ok: Boolean!\n  error: String\n  user: User\n}\n\ntype GmailConnectionResponse {\n  ok: Boolean!\n  error: String\n  token: String\n}\n\ntype User {\n  _id: ID!\n  name: String!\n  phoneNumber: PhoneNumber!\n  password: String\n  email: EmailAddress!\n  isPhoneVerified: Boolean!\n  isEmailVerified: Boolean!\n  userRole: UserRole!\n  checkPrivacyPolicy: Boolean!\n  houses: [House!]!\n  createdAt: DateTime!\n  updatedAt: DateTime\n}\n\nenum UserRole {\n  ADMIN\n  HOST\n  BOOKER\n  GHOST\n}\n\ntype StartPhoneVerificationResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype UpdateMyProfileResponse {\n  ok: Boolean!\n  error: String\n  user: User\n}\n\ntype ChangePasswordResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype Verification {\n  _id: ID!\n  target: VerificationTarget!\n  payload: String!\n  verified: Boolean!\n  key: String!\n  user: User!\n  createdAt: String!\n  updatedAt: String\n}\n\nenum VerificationTarget {\n  PHONE\n  EMAIL\n}\n"];
/* tslint:disable */

export interface Query {
  EmailSignIn: EmailSignInResponse;
  GetMyProfile: GetMyProfileResponse;
}

export interface EmailSignInQueryArgs {
  email: string;
  password: string;
}

export interface EmailSignInResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface GetMyProfileResponse {
  ok: boolean;
  error: string | null;
  user: User | null;
}

export interface User {
  _id: string;
  name: string;
  phoneNumber: PhoneNumber;
  password: string | null;
  email: EmailAddress;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  userRole: UserRole;
  checkPrivacyPolicy: boolean;
  houses: Array<House>;
  createdAt: DateTime;
  updatedAt: DateTime | null;
}

export type PhoneNumber = any;

export type EmailAddress = any;

export type UserRole = "ADMIN" | "HOST" | "BOOKER" | "GHOST";

export interface House {
  _id: string;
  name: string;
  houseType: HouseType;
  user: User;
  location: Location;
  refundPolicy: Array<TermsOfRefund>;
  termsOfBooking: TermsOfBooking;
  createdAt: DateTime;
  updatedAt: DateTime | null;
}

export type HouseType = "GUEST_HOUSE" | "HOSTEL" | "HOTEL" | "MOTEL" | "PENSION" | "YOUTH_HOSTEL";

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface TermsOfRefund {
  beforeDays: number;
  rate: number;
  description: string | null;
}

export interface TermsOfBooking {
  farthestSelectableDate: number;
  nearestSelectableDate: number;
  selectableDateRange: number;
}

export type DateTime = any;

export interface Mutation {
  CreateHouse: CreateHouseResponse;
  DeleteHouse: DeleteHouseResponse;
  UpdateHouse: UpdateHouseResponse;
  CreateRoomType: CreateRoomTypeResponse;
  DeleteRoomType: DeleteRoomTypeResponse;
  UpdateRoomType: UpdateRoomTypeResponse;
  CompletePhoneVerification: CompletePhoneVerificationResponse;
  EmailSignUp: EmailSignUpResponse;
  GmailConnect: GmailConnectionResponse;
  StartPhoneVerification: StartPhoneVerificationResponse;
  UpdateMyProfile: UpdateMyProfileResponse;
  ChangePassword: ChangePasswordResponse;
}

export interface CreateHouseMutationArgs {
  name: string;
  houseType: HouseType;
  location: LocationInput;
}

export interface DeleteHouseMutationArgs {
  _id: string;
}

export interface UpdateHouseMutationArgs {
  houseId: string;
  name: string | null;
  houseType: HouseType | null;
  location: LocationInput | null;
  refundPolicy: Array<TermsOfRefundInput>;
  termsOfBooking: TermsOfBookingInput | null;
}

export interface CreateRoomTypeMutationArgs {
  name: string;
  house: string;
  pricingType: PricingType;
  peopleCount: number;
  peopleCountMax: number | null;
  isEnable: boolean;
  description: string | null;
  tags: Array<TagInput>;
}

export interface DeleteRoomTypeMutationArgs {
  roomTypeId: string;
}

export interface UpdateRoomTypeMutationArgs {
  roomTypeId: string;
  name: string | null;
  peopleCount: number | null;
  peopleCountMax: number | null;
  index: number | null;
  isEnable: boolean | null;
  description: string | null;
}

export interface CompletePhoneVerificationMutationArgs {
  key: string;
}

export interface EmailSignUpMutationArgs {
  name: string;
  email: EmailAddress;
  password: Password;
  phoneNumber: PhoneNumber;
}

export interface GmailConnectMutationArgs {
  firstName: string;
  lastName: string;
  gmail: string;
}

export interface UpdateMyProfileMutationArgs {
  name: string;
  phoneNumber: string;
  password: string;
}

export interface ChangePasswordMutationArgs {
  currentPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

export interface LocationInput {
  address: string;
  lat: number;
  lng: number;
}

export interface CreateHouseResponse {
  ok: boolean;
  error: string | null;
  house: House | null;
}

export interface DeleteHouseResponse {
  ok: boolean;
  error: string | null;
}

export interface TermsOfRefundInput {
  beforeDays: number;
  rate: number;
  description: string | null;
}

export interface TermsOfBookingInput {
  farthestSelectableDate: number;
  nearestSelectableDate: number;
  selectableDateRange: number;
}

export interface UpdateHouseResponse {
  ok: boolean;
  error: string | null;
  house: House | null;
}

export type PricingType = "DOMITORY" | "ROOM";

export interface TagInput {
  name: string;
  content: string;
  icon: string | null;
}

export interface CreateRoomTypeResponse {
  ok: boolean;
  error: string | null;
  roomType: RoomType | null;
}

export interface RoomType {
  _id: string;
  name: string;
  house: House;
  pricingType: PricingType;
  peopleCount: number;
  peopleCountMax: number;
  index: number;
  roomCount: number;
  isEnable: boolean;
  description: string;
  tags: Array<Tag>;
  rooms: Array<Room>;
  createdAt: string;
  updatedAt: string | null;
}

export interface Tag {
  name: string;
  content: string;
  icon: string;
}

export interface Room {
  _id: string;
  name: string;
  roomType: RoomType;
  isEnable: boolean;
  createdAt: DateTime | null;
  updatedAt: DateTime | null;
}

export interface DeleteRoomTypeResponse {
  ok: boolean;
  error: string | null;
}

export interface UpdateRoomTypeResponse {
  ok: boolean;
  error: string | null;
  roomType: RoomType | null;
}

export interface CompletePhoneVerificationResponse {
  ok: boolean;
  error: string | null;
}

export type Password = any;

export interface EmailSignUpResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface GmailConnectionResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface StartPhoneVerificationResponse {
  ok: boolean;
  error: string | null;
}

export interface UpdateMyProfileResponse {
  ok: boolean;
  error: string | null;
  user: User | null;
}

export interface ChangePasswordResponse {
  ok: boolean;
  error: string | null;
}

export interface Booking {
  _id: string;
  house: House;
  booker: User;
  roomTypes: Array<RoomType>;
  dateRange: DateRange;
  price: number;
  bookingStatus: BookingStatus;
  guests: Array<string>;
  memo: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
  isPast: boolean;
}

export type BookingStatus = "WAIT_DEPOSIT" | "COMPLETE" | "CANCEL" | "REFUND_WAIT" | "PAY_WHEN_CHK_IN";

export type Date = any;

export type Name = any;

export type URL = any;

export type Day = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export interface DateRangeInput {
  startDate: string;
  endDate: string;
}

export interface Guest {
  _id: string;
  house: House;
  booker: User;
  roomType: string;
  guestType: string;
  allocatedRoom: Room;
  stay: string;
  price: number;
  isChkIn: boolean;
  bookingId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface SeasonPrice {
  _id: string;
  house: House;
  roomType: RoomType;
  season: Season;
  price: number;
  applyDays: Array<Day>;
}

export interface Season {
  _id: string;
  house: House;
  name: string;
  dateRange: DateRange;
  color: string;
  description: string;
}

export interface SeasonPriceInput {
  price: number;
  applyDays: number;
}

export interface RoomPrice {
  _id: string;
  house: House;
  roomType: RoomType;
  price: number;
  date: string;
}

export interface Verification {
  _id: string;
  target: VerificationTarget;
  payload: string;
  verified: boolean;
  key: string;
  user: User;
  createdAt: string;
  updatedAt: string | null;
}

export type VerificationTarget = "PHONE" | "EMAIL";
