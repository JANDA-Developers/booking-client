/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllProductTypes
// ====================================================

export interface getAllProductTypes_GetAllProductTypes_productTypes {
  __typename: "ProductType";
  _id: string;
  /**
   * 제품 이름
   */
  name: string;
}

export interface getAllProductTypes_GetAllProductTypes {
  __typename: "GetAllProductTypesResponse";
  ok: boolean;
  error: string | null;
  productTypes: getAllProductTypes_GetAllProductTypes_productTypes[] | null;
}

export interface getAllProductTypes {
  GetAllProductTypes: getAllProductTypes_GetAllProductTypes;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMyProfile
// ====================================================

export interface getMyProfile_GetMyProfile_user_houses_hostApplication {
  __typename: "HostApplication";
  url: any;
}

export interface getMyProfile_GetMyProfile_user_houses_product_productType {
  __typename: "ProductType";
  _id: string;
}

export interface getMyProfile_GetMyProfile_user_houses_product {
  __typename: "Product";
  _id: string;
  /**
   * 제품 이름
   */
  name: string;
  productType: getMyProfile_GetMyProfile_user_houses_product_productType;
}

export interface getMyProfile_GetMyProfile_user_houses_location {
  __typename: "Location";
  address: string;
  addressDetail: string | null;
}

export interface getMyProfile_GetMyProfile_user_houses {
  __typename: "House";
  hostApplication: getMyProfile_GetMyProfile_user_houses_hostApplication | null;
  product: getMyProfile_GetMyProfile_user_houses_product | null;
  _id: string;
  name: string;
  houseType: HouseType;
  location: getMyProfile_GetMyProfile_user_houses_location;
  createdAt: any;
  updatedAt: any | null;
}

export interface getMyProfile_GetMyProfile_user {
  __typename: "User";
  _id: string;
  name: any;
  phoneNumber: any;
  password: any | null;
  email: any;
  isPhoneVerified: boolean;
  profileImg: any | null;
  checkPrivacyPolicy: boolean;
  userRole: UserRole;
  houses: getMyProfile_GetMyProfile_user_houses[];
  createdAt: any;
  updatedAt: any | null;
}

export interface getMyProfile_GetMyProfile {
  __typename: "GetMyProfileResponse";
  user: getMyProfile_GetMyProfile_user | null;
}

export interface getMyProfile {
  /**
   * 로그인 token 필요!
   */
  GetMyProfile: getMyProfile_GetMyProfile;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getHousesForSU
// ====================================================

export interface getHousesForSU_GetHousesForSU_houses_user {
  __typename: "User";
  _id: string;
  phoneNumber: any;
  profileImg: any | null;
}

export interface getHousesForSU_GetHousesForSU_houses_location {
  __typename: "Location";
  address: string;
  addressDetail: string | null;
}

export interface getHousesForSU_GetHousesForSU_houses_product_productType {
  __typename: "ProductType";
  _id: string;
}

export interface getHousesForSU_GetHousesForSU_houses_product {
  __typename: "Product";
  _id: string;
  /**
   * 제품 이름
   */
  name: string;
  productType: getHousesForSU_GetHousesForSU_houses_product_productType;
}

export interface getHousesForSU_GetHousesForSU_houses {
  __typename: "House";
  _id: string;
  name: string;
  houseType: HouseType;
  user: getHousesForSU_GetHousesForSU_houses_user;
  location: getHousesForSU_GetHousesForSU_houses_location;
  createdAt: any;
  updatedAt: any | null;
  product: getHousesForSU_GetHousesForSU_houses_product | null;
}

export interface getHousesForSU_GetHousesForSU_pageInfo {
  __typename: "PageInfoOffsetBase";
  currentPage: number;
  totalPage: number;
  rowCount: number;
}

export interface getHousesForSU_GetHousesForSU {
  __typename: "GetHousesForSUResponse";
  ok: boolean;
  error: string | null;
  houses: getHousesForSU_GetHousesForSU_houses[] | null;
  pageInfo: getHousesForSU_GetHousesForSU_pageInfo | null;
}

export interface getHousesForSU {
  /**
   * 슈퍼계정으로 모든 집들을 가져옴.
   */
  GetHousesForSU: getHousesForSU_GetHousesForSU;
}

export interface getHousesForSUVariables {
  page: number;
  count: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: emailSignIn
// ====================================================

export interface emailSignIn_EmailSignIn {
  __typename: "EmailSignInResponse";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface emailSignIn {
  EmailSignIn: emailSignIn_EmailSignIn;
}

export interface emailSignInVariables {
  email: any;
  password: any;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getHouse
// ====================================================

export interface getHouse_GetHouse_house_hostApplication {
  __typename: "HostApplication";
  url: any;
}

export interface getHouse_GetHouse_house_product_productType {
  __typename: "ProductType";
  _id: string;
}

export interface getHouse_GetHouse_house_product {
  __typename: "Product";
  _id: string;
  /**
   * 제품 이름
   */
  name: string;
  productType: getHouse_GetHouse_house_product_productType;
}

export interface getHouse_GetHouse_house_location {
  __typename: "Location";
  address: string;
  addressDetail: string | null;
}

export interface getHouse_GetHouse_house {
  __typename: "House";
  _id: string;
  name: string;
  houseType: HouseType;
  hostApplication: getHouse_GetHouse_house_hostApplication | null;
  product: getHouse_GetHouse_house_product | null;
  location: getHouse_GetHouse_house_location;
  createdAt: any;
  updatedAt: any | null;
}

export interface getHouse_GetHouse {
  __typename: "GetHouseResponse";
  ok: boolean;
  error: string | null;
  house: getHouse_GetHouse_house | null;
}

export interface getHouse {
  GetHouse: getHouse_GetHouse;
}

export interface getHouseVariables {
  houseId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllRoomType
// ====================================================

export interface getAllRoomType_GetAllRoomType_roomTypes_rooms {
  __typename: "Room";
  _id: string;
  name: string;
  index: number;
  createdAt: any;
  updatedAt: any | null;
}

export interface getAllRoomType_GetAllRoomType_roomTypes {
  __typename: "RoomType";
  _id: string;
  name: string;
  pricingType: PricingType;
  peopleCount: number;
  peopleCountMax: number;
  roomGender: RoomGender;
  roomCount: number;
  index: number;
  description: string | null;
  createdAt: any;
  updatedAt: any | null;
  img: any | null;
  rooms: getAllRoomType_GetAllRoomType_roomTypes_rooms[];
}

export interface getAllRoomType_GetAllRoomType {
  __typename: "GetAllRoomTypeResponse";
  ok: boolean | null;
  error: string | null;
  roomTypes: getAllRoomType_GetAllRoomType_roomTypes[] | null;
}

export interface getAllRoomType {
  GetAllRoomType: getAllRoomType_GetAllRoomType;
}

export interface getAllRoomTypeVariables {
  houseId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllRoomTypePrice
// ====================================================

export interface getAllRoomTypePrice_GetAllRoomType_roomTypes {
  __typename: "RoomType";
  _id: string;
  name: string;
  index: number;
  description: string | null;
}

export interface getAllRoomTypePrice_GetAllRoomType {
  __typename: "GetAllRoomTypeResponse";
  ok: boolean | null;
  error: string | null;
  roomTypes: getAllRoomTypePrice_GetAllRoomType_roomTypes[] | null;
}

export interface getAllRoomTypePrice_GetAllRoomPrice_roomPrices_roomType {
  __typename: "RoomType";
  _id: string;
}

export interface getAllRoomTypePrice_GetAllRoomPrice_roomPrices {
  __typename: "RoomPrice";
  _id: string;
  price: number;
  date: any;
  roomType: getAllRoomTypePrice_GetAllRoomPrice_roomPrices_roomType;
}

export interface getAllRoomTypePrice_GetAllRoomPrice {
  __typename: "GetAllRoomPriceResponse";
  ok: boolean;
  error: string | null;
  roomPrices: getAllRoomTypePrice_GetAllRoomPrice_roomPrices[] | null;
}

export interface getAllRoomTypePrice {
  GetAllRoomType: getAllRoomTypePrice_GetAllRoomType;
  GetAllRoomPrice: getAllRoomTypePrice_GetAllRoomPrice;
}

export interface getAllRoomTypePriceVariables {
  houseId: string;
  start: any;
  end: any;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserForSU
// ====================================================

export interface getUserForSU_GetUserForSU_user_houses_hostApplication {
  __typename: "HostApplication";
  url: any;
}

export interface getUserForSU_GetUserForSU_user_houses_product_productType {
  __typename: "ProductType";
  _id: string;
}

export interface getUserForSU_GetUserForSU_user_houses_product {
  __typename: "Product";
  _id: string;
  /**
   * 제품 이름
   */
  name: string;
  productType: getUserForSU_GetUserForSU_user_houses_product_productType;
}

export interface getUserForSU_GetUserForSU_user_houses_location {
  __typename: "Location";
  address: string;
  addressDetail: string | null;
}

export interface getUserForSU_GetUserForSU_user_houses {
  __typename: "House";
  hostApplication: getUserForSU_GetUserForSU_user_houses_hostApplication | null;
  product: getUserForSU_GetUserForSU_user_houses_product | null;
  _id: string;
  name: string;
  houseType: HouseType;
  location: getUserForSU_GetUserForSU_user_houses_location;
  createdAt: any;
  updatedAt: any | null;
}

export interface getUserForSU_GetUserForSU_user {
  __typename: "User";
  _id: string;
  name: any;
  phoneNumber: any;
  password: any | null;
  email: any;
  isPhoneVerified: boolean;
  profileImg: any | null;
  checkPrivacyPolicy: boolean;
  userRole: UserRole;
  houses: getUserForSU_GetUserForSU_user_houses[];
  createdAt: any;
  updatedAt: any | null;
}

export interface getUserForSU_GetUserForSU {
  __typename: "GetUserForSUResponse";
  ok: boolean;
  error: string | null;
  user: getUserForSU_GetUserForSU_user | null;
}

export interface getUserForSU {
  GetUserForSU: getUserForSU_GetUserForSU;
}

export interface getUserForSUVariables {
  userId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllSeason
// ====================================================

export interface getAllSeason_GetAllSeason_seasons {
  __typename: "Season";
  _id: string;
  name: string;
  start: any;
  end: any;
  priority: number;
  color: string | null;
  description: string | null;
  createdAt: any;
  updatedAt: any | null;
}

export interface getAllSeason_GetAllSeason {
  __typename: "GetAllSeasonResponse";
  ok: boolean;
  error: string | null;
  seasons: getAllSeason_GetAllSeason_seasons[] | null;
}

export interface getAllSeason_GetAllRoomType_roomTypes {
  __typename: "RoomType";
  _id: string;
  name: string;
  index: number;
  description: string | null;
}

export interface getAllSeason_GetAllRoomType {
  __typename: "GetAllRoomTypeResponse";
  ok: boolean | null;
  error: string | null;
  roomTypes: getAllSeason_GetAllRoomType_roomTypes[] | null;
}

export interface getAllSeason {
  GetAllSeason: getAllSeason_GetAllSeason;
  GetAllRoomType: getAllSeason_GetAllRoomType;
}

export interface getAllSeasonVariables {
  houseId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllSeasonTable
// ====================================================

export interface getAllSeasonTable_GetAllSeason_seasons {
  __typename: "Season";
  _id: string;
  name: string;
  start: any;
  end: any;
  priority: number;
  color: string | null;
  description: string | null;
  createdAt: any;
  updatedAt: any | null;
}

export interface getAllSeasonTable_GetAllSeason {
  __typename: "GetAllSeasonResponse";
  ok: boolean;
  error: string | null;
  seasons: getAllSeasonTable_GetAllSeason_seasons[] | null;
}

export interface getAllSeasonTable_GetAllRoomType_roomTypes {
  __typename: "RoomType";
  _id: string;
  name: string;
  index: number;
  description: string | null;
}

export interface getAllSeasonTable_GetAllRoomType {
  __typename: "GetAllRoomTypeResponse";
  ok: boolean | null;
  error: string | null;
  roomTypes: getAllSeasonTable_GetAllRoomType_roomTypes[] | null;
}

export interface getAllSeasonTable_GetSeasonPrice_seasonPrices_roomType {
  __typename: "RoomType";
  _id: string;
}

export interface getAllSeasonTable_GetSeasonPrice_seasonPrices_season {
  __typename: "Season";
  _id: string;
}

export interface getAllSeasonTable_GetSeasonPrice_seasonPrices_dayOfWeekPrices {
  __typename: "DayOfWeekPrice";
  price: number;
  applyDays: number;
}

export interface getAllSeasonTable_GetSeasonPrice_seasonPrices {
  __typename: "SeasonPrice";
  _id: string;
  roomType: getAllSeasonTable_GetSeasonPrice_seasonPrices_roomType;
  season: getAllSeasonTable_GetSeasonPrice_seasonPrices_season;
  defaultPrice: number;
  dayOfWeekPrices: getAllSeasonTable_GetSeasonPrice_seasonPrices_dayOfWeekPrices[] | null;
}

export interface getAllSeasonTable_GetSeasonPrice {
  __typename: "GetSeasonPriceResponse";
  ok: boolean;
  error: string | null;
  seasonPrices: getAllSeasonTable_GetSeasonPrice_seasonPrices[] | null;
}

export interface getAllSeasonTable {
  GetAllSeason: getAllSeasonTable_GetAllSeason;
  GetAllRoomType: getAllSeasonTable_GetAllRoomType;
  /**
   * houseId에 해당하는 전체 방 타입 시즌 가격 가져오기
   */
  GetSeasonPrice: getAllSeasonTable_GetSeasonPrice;
}

export interface getAllSeasonTableVariables {
  houseId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createBooking
// ====================================================

export interface createBooking_CreateBooking {
  __typename: "CreateBookingResponse";
  ok: boolean;
  error: string | null;
}

export interface createBooking {
  CreateBooking: createBooking_CreateBooking;
}

export interface createBookingVariables {
  bookingParams: BookingInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createRoomType
// ====================================================

export interface createRoomType_CreateRoomType {
  __typename: "CreateRoomTypeResponse";
  ok: boolean;
  error: string | null;
}

export interface createRoomType {
  /**
   * 로그인 token 필요함!
   */
  CreateRoomType: createRoomType_CreateRoomType;
}

export interface createRoomTypeVariables {
  name: string;
  houseId: string;
  pricingType: PricingType;
  peopleCount: number;
  peopleCountMax?: number | null;
  description?: string | null;
  tags?: TagInput[] | null;
  img?: any | null;
  roomGender?: RoomGender | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createRoom
// ====================================================

export interface createRoom_CreateRoom {
  __typename: "CreateRoomResponse";
  ok: boolean | null;
  error: string | null;
}

export interface createRoom {
  CreateRoom: createRoom_CreateRoom;
}

export interface createRoomVariables {
  name: string;
  roomType: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createRoomPrice
// ====================================================

export interface createRoomPrice_CreateRoomPrice {
  __typename: "CreateRoomPriceResponse";
  ok: boolean;
  error: string | null;
}

export interface createRoomPrice {
  /**
   * 만약 RoomTypeId로 조회한 방타입이 해당 날짜에 RoomPrice가 존재한다면 가격 덮어 씌움
   */
  CreateRoomPrice: createRoomPrice_CreateRoomPrice;
}

export interface createRoomPriceVariables {
  price: number;
  roomTypeId: string;
  houseId: string;
  date: any;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteRoomType
// ====================================================

export interface deleteRoomType_DeleteRoomType {
  __typename: "DeleteRoomTypeResponse";
  ok: boolean;
  error: string | null;
}

export interface deleteRoomType {
  DeleteRoomType: deleteRoomType_DeleteRoomType;
}

export interface deleteRoomTypeVariables {
  houseId: string;
  roomTypeId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteRoom
// ====================================================

export interface deleteRoom_DeleteRoom {
  __typename: "DeleteRoomResponse";
  ok: boolean;
  error: string | null;
}

export interface deleteRoom {
  DeleteRoom: deleteRoom_DeleteRoom;
}

export interface deleteRoomVariables {
  roomId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateRoom
// ====================================================

export interface updateRoom_UpdateRoom {
  __typename: "UpdateRoomResponse";
  ok: boolean;
  error: string | null;
}

export interface updateRoom {
  UpdateRoom: updateRoom_UpdateRoom;
}

export interface updateRoomVariables {
  roomId: string;
  name?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateRoomType
// ====================================================

export interface updateRoomType_UpdateRoomType {
  __typename: "UpdateRoomTypeResponse";
  ok: boolean;
  error: string | null;
}

export interface updateRoomType {
  UpdateRoomType: updateRoomType_UpdateRoomType;
}

export interface updateRoomTypeVariables {
  roomTypeId: string;
  houseId: string;
  name?: string | null;
  peopleCount?: number | null;
  peopleCountMax?: number | null;
  description?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createSeasonPrice
// ====================================================

export interface createSeasonPrice_CreateSeasonPrice {
  __typename: "CreateSeasonPriceResponse";
  ok: boolean;
  error: string | null;
}

export interface createSeasonPrice {
  CreateSeasonPrice: createSeasonPrice_CreateSeasonPrice;
}

export interface createSeasonPriceVariables {
  roomTypeId: string;
  seasonId: string;
  defaultPrice: number;
  dayOfWeekPrices?: DayOfWeekPriceInput[] | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createSeason
// ====================================================

export interface createSeason_CreateSeason {
  __typename: "CreateSeasonResponse";
  ok: boolean;
  error: string | null;
}

export interface createSeason {
  CreateSeason: createSeason_CreateSeason;
}

export interface createSeasonVariables {
  name: string;
  start: any;
  end: any;
  houseId: string;
  color?: string | null;
  description?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteSeason
// ====================================================

export interface deleteSeason_DeleteSeason {
  __typename: "DeleteSeasonResponse";
  ok: boolean;
  error: string | null;
}

export interface deleteSeason {
  DeleteSeason: deleteSeason_DeleteSeason;
}

export interface deleteSeasonVariables {
  seasonId: string;
  houseId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateSeason
// ====================================================

export interface updateSeason_UpdateSeason {
  __typename: "UpdateSeasonResponse";
  ok: boolean | null;
  error: string | null;
}

export interface updateSeason {
  UpdateSeason: updateSeason_UpdateSeason;
}

export interface updateSeasonVariables {
  name: string;
  start: any;
  end: any;
  seasonId: string;
  color?: string | null;
  description?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateMyProfile
// ====================================================

export interface updateMyProfile_UpdateMyProfile {
  __typename: "UpdateMyProfileResponse";
  ok: boolean;
  error: string | null;
}

export interface updateMyProfile {
  UpdateMyProfile: updateMyProfile_UpdateMyProfile;
}

export interface updateMyProfileVariables {
  name: any;
  phoneNumber: any;
  email: any;
  password: any;
  profileImg?: any | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: startPhoneVerification
// ====================================================

export interface startPhoneVerification_StartPhoneVerification {
  __typename: "StartPhoneVerificationResponse";
  ok: boolean;
  error: string | null;
}

export interface startPhoneVerification {
  StartPhoneVerification: startPhoneVerification_StartPhoneVerification;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: completePhoneVerification
// ====================================================

export interface completePhoneVerification_CompletePhoneVerification {
  __typename: "CompletePhoneVerificationResponse";
  ok: boolean;
  error: string | null;
}

export interface completePhoneVerification {
  CompletePhoneVerification: completePhoneVerification_CompletePhoneVerification;
}

export interface completePhoneVerificationVariables {
  key: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: emailSignUp
// ====================================================

export interface emailSignUp_EmailSignUp {
  __typename: "EmailSignUpResponse";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface emailSignUp {
  EmailSignUp: emailSignUp_EmailSignUp;
}

export interface emailSignUpVariables {
  name: any;
  email: any;
  phoneNumber: any;
  password: any;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateHouse
// ====================================================

export interface updateHouse_UpdateHouse {
  __typename: "UpdateHouseResponse";
  ok: boolean;
  error: string | null;
}

export interface updateHouse {
  UpdateHouse: updateHouse_UpdateHouse;
}

export interface updateHouseVariables {
  houseId: string;
  name?: string | null;
  houseType: HouseType;
  location: LocationInput;
  refundPolicy?: TermsOfRefundInput[] | null;
  termsOfBooking?: TermsOfBookingInput | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createHouse
// ====================================================

export interface createHouse_CreateHouse_house {
  __typename: "House";
  _id: string;
  name: string;
}

export interface createHouse_CreateHouse {
  __typename: "CreateHouseResponse";
  ok: boolean;
  error: string | null;
  house: createHouse_CreateHouse_house | null;
}

export interface createHouse {
  CreateHouse: createHouse_CreateHouse;
}

export interface createHouseVariables {
  name: string;
  houseType: HouseType;
  location: LocationInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteHouse
// ====================================================

export interface deleteHouse_DeleteHouse {
  __typename: "DeleteHouseResponse";
  ok: boolean;
  error: string | null;
}

export interface deleteHouse {
  DeleteHouse: deleteHouse_DeleteHouse;
}

export interface deleteHouseVariables {
  id: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: buyProduct
// ====================================================

export interface buyProduct_BuyProduct {
  __typename: "BuyProductResponse";
  ok: boolean;
  error: string | null;
}

export interface buyProduct {
  BuyProduct: buyProduct_BuyProduct;
}

export interface buyProductVariables {
  houseId: string;
  productTypeId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: refundProduct
// ====================================================

export interface refundProduct_RefundProduct {
  __typename: "RefundProductResponse";
  ok: boolean;
  error: string | null;
}

export interface refundProduct {
  RefundProduct: refundProduct_RefundProduct;
}

export interface refundProductVariables {
  houseId: string;
  productId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: fieldsLocation
// ====================================================

export interface fieldsLocation_location {
  __typename: "Location";
  address: string;
  addressDetail: string | null;
}

export interface fieldsLocation {
  __typename: "House";
  location: fieldsLocation_location;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FminiRoomType
// ====================================================

export interface FminiRoomType {
  __typename: "RoomType";
  _id: string;
  name: string;
  index: number;
  description: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FpageInfo
// ====================================================

export interface FpageInfo {
  __typename: "PageInfoOffsetBase";
  currentPage: number;
  totalPage: number;
  rowCount: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: fieldsUser
// ====================================================

export interface fieldsUser_houses_hostApplication {
  __typename: "HostApplication";
  url: any;
}

export interface fieldsUser_houses_product_productType {
  __typename: "ProductType";
  _id: string;
}

export interface fieldsUser_houses_product {
  __typename: "Product";
  _id: string;
  /**
   * 제품 이름
   */
  name: string;
  productType: fieldsUser_houses_product_productType;
}

export interface fieldsUser_houses_location {
  __typename: "Location";
  address: string;
  addressDetail: string | null;
}

export interface fieldsUser_houses {
  __typename: "House";
  hostApplication: fieldsUser_houses_hostApplication | null;
  product: fieldsUser_houses_product | null;
  _id: string;
  name: string;
  houseType: HouseType;
  location: fieldsUser_houses_location;
  createdAt: any;
  updatedAt: any | null;
}

export interface fieldsUser {
  __typename: "User";
  _id: string;
  name: any;
  phoneNumber: any;
  password: any | null;
  email: any;
  isPhoneVerified: boolean;
  profileImg: any | null;
  checkPrivacyPolicy: boolean;
  userRole: UserRole;
  houses: fieldsUser_houses[];
  createdAt: any;
  updatedAt: any | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * 도미토리 방식으로 예약한 게스트만 적용됨
 */
export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

export enum GuestType {
  BLOCK_ROOM = "BLOCK_ROOM",
  DOMITORY = "DOMITORY",
  ROOM = "ROOM",
}

export enum HouseType {
  GUEST_HOUSE = "GUEST_HOUSE",
  HOSTEL = "HOSTEL",
  HOTEL = "HOTEL",
  MOTEL = "MOTEL",
  PENSION = "PENSION",
  YOUTH_HOSTEL = "YOUTH_HOSTEL",
}

export enum PricingType {
  DOMITORY = "DOMITORY",
  ROOM = "ROOM",
}

export enum RoomGender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  MIXED = "MIXED",
  SEPARATELY = "SEPARATELY",
}

export enum UserRole {
  ADMIN = "ADMIN",
  GHOST = "GHOST",
  GUEST = "GUEST",
  HOST = "HOST",
}

export interface BookerInput {
  house: string;
  booking?: string | null;
  name: any;
  password: string;
  phoneNumber: any;
  email?: any | null;
  agreePrivacyPolicy: boolean;
  memo?: string | null;
}

export interface BookingInput {
  booker: BookerInput;
  start: any;
  end: any;
  guest: GuestPartInput[];
}

export interface DayOfWeekPriceInput {
  price: number;
  applyDays: number;
}

export interface GuestPartInput {
  roomTypeId: string;
  price: number;
  discountedPrice?: number | null;
  guestType: GuestType;
  count: number;
  genders?: Gender[] | null;
}

export interface LocationInput {
  address: string;
  addressDetail?: string | null;
  lat: number;
  lng: number;
}

export interface TagInput {
  name: string;
  content: string;
  icon?: string | null;
}

export interface TermsOfBookingInput {
  farthestSelectableDate: number;
  nearestSelectableDate: number;
  selectableDateRange: number;
}

export interface TermsOfRefundInput {
  beforeDays: number;
  rate: number;
  description?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
