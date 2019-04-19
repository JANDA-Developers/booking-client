import React, { Fragment } from 'react';
import { getHousesForSU_GetHousesForSU_result_edges_node as Ihouse } from '../../../types/api';
import { IUseModal } from '../../../actions/hook';
import Preloader from '../../../atoms/preloader/Preloader';
import './SuperMain.scss';
import JDPagination from '../../../components/pagination/Pagination';
import HouseCard from './components/houseCard';
import { IPageInfo } from '../../../types/interface';

interface Iprops {
  houseData: Ihouse[];
  loading: boolean;
  userModal: IUseModal;
  pageData: IPageInfo | {};
}

const SuperMain: React.SFC<Iprops> = ({
  userModal, houseData, loading, pageData,
}) => (
  <div id="superMain" className="container container--sm">
    <div className="docs-section">
      <Fragment>
        {loading && <Preloader />}
        <div className="docs-section__box">
          {houseData.map((house: Ihouse) => (
            <HouseCard houseData={house} userModal={userModal} />
          ))}
        </div>
        <JDPagination pageCount={4} pageRangeDisplayed={5} marginPagesDisplayed={4} />
      </Fragment>
    </div>
  </div>
);

export default SuperMain;