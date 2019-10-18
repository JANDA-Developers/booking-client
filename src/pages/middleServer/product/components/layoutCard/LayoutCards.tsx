import React from "react";
import "./LayoutCards.scss";
import Card, {CardProps} from "../../../../../atoms/cards/Card";
import Button from "../../../../../atoms/button/Button";
import {Fragment} from "react";
import Radio from "../../../../../atoms/forms/radio/Radio";
import {LayoutType} from "../../../../../types/enum";

interface IProps extends CardProps {
  selectedLayout?: any;
  setLayout?: any;
}

interface layout {
  id: string;
  name: string;
  link: string;
  img: string;
  desc: string | JSX.Element;
}

const layouts: layout[] = [
  {
    id: LayoutType.Layout_A,
    name: "A타입 레이아웃",
    link: "http://janda-install.kr/",
    desc: "기본제공",
    img:
      "https://res.cloudinary.com/stayjanda-com/image/upload/v1560234616/layout_type_A.jpg"
  },
  {
    id: LayoutType.Layout_B,
    name: "B타입 레이아웃",
    desc: (
      <span>
        추가비용 50,000 <br />
        <span className="JDsmall-text">(첫구매시만 발생)</span>
      </span>
    ),
    link: "http://colton123.net/",
    img:
      "https://res.cloudinary.com/stayjanda-com/image/upload/v1560234623/type_B_layout.jpg"
  }
];

const LayoutCards: React.FC<IProps> = ({
  selectedLayout,
  setLayout,
  ...props
}) => {
  const handleClickCard = (id: string, url: string) => {
    setLayout && setLayout(id);
    window.open(url, "_blank");
  };

  return (
    <Fragment>
      {layouts.map(layout => {
        const layoutImg = {
          backgroundImage: `url("${layout.img}")`
        };
        return (
          <div key={layout.id}>
            <span>
              <Radio
                selectedValue={selectedLayout}
                onChange={setLayout}
                value={layout.id}
                label={layout.name}
                groupName="layout"
                id={layout.id}
              />
            </span>
            <Card
              selected={selectedLayout && selectedLayout === layout.id}
              className="layoutCard"
              {...props}
            >
              <div style={layoutImg} className="layoutCard__imgBox" />
              <div className="layoutCard__bottomWrap">
                <Button
                  onClick={() => {
                    handleClickCard(layout.id, layout.link);
                  }}
                  mode="flat"
                  thema="grey"
                  label="살펴보기"
                />
              </div>
            </Card>
            <div>
              <span>{layout.desc}</span>
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default LayoutCards;