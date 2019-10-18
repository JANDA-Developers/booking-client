import React from "react";
import {Mutation, Query} from "react-apollo";
import {DELETE_HOUSE, GET_USER_INFO, GET_HOUSE} from "../../../../queries";
import MyHouseModal from "./myHouseModal";
import {IUseModal} from "../../../../hooks/hook";
import {
  onCompletedMessage,
  queryDataFormater,
  showError,
  isEmpty
} from "../../../../utils/utils";
import {SELECT_HOUSE, SELECTED_HOUSE} from "../../../../clientQueries";
import {
  getHouse,
  getHouseVariables,
  deleteHouse,
  deleteHouseVariables
} from "../../../../types/api";

interface IProps {
  MyHouseModalHook: IUseModal;
}
class GetHouseQuery extends Query<getHouse, getHouseVariables> {}
class DeleteHouseMutation extends Mutation<deleteHouse, deleteHouseVariables> {}

const MyHouseModalWrap: React.SFC<IProps> = ({MyHouseModalHook: modalHook}) => (
  <DeleteHouseMutation
    mutation={DELETE_HOUSE}
    refetchQueries={[{query: GET_USER_INFO}, {query: SELECTED_HOUSE}]}
    variables={{
      id: modalHook.info.houseId
    }}
    onCompleted={({DeleteHouse}) => {
      onCompletedMessage(DeleteHouse, "숙소삭제 완료", "숙소삭제 실패");
      return false;
    }}
  >
    {deleteMutation => (
      <Mutation
        mutation={SELECT_HOUSE}
        onCompleted={({selectHouse}: any) => {
          onCompletedMessage(selectHouse, "현재숙소변경", "");
        }}
      >
        {(houseChangeMutation: any) => (
          <GetHouseQuery
            fetchPolicy="network-only"
            query={GET_HOUSE}
            skip={isEmpty(modalHook.info.houseId)}
            variables={{houseId: modalHook.info.houseId}}
          >
            {({data: houseData, loading, error}) => {
              const house = queryDataFormater(
                houseData,
                "GetHouse",
                "house",
                undefined
              );
              return (
                <MyHouseModal
                  loading={loading}
                  modalHook={modalHook}
                  deleteMu={deleteMutation}
                  houseChangeMu={houseChangeMutation}
                  house={house}
                />
              );
            }}
          </GetHouseQuery>
        )}
      </Mutation>
    )}
  </DeleteHouseMutation>
);

export default MyHouseModalWrap;