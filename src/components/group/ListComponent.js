// 생성자 : Haein

import { useEffect, useState } from "react";
import { getGroupList } from "../../api/mainApi";
import { getImage } from "../../api/mainApi";
import { useNavigate } from "react-router-dom";

const ListComponent = ({ isOnline }) => {
  const navigate = useNavigate();

  const [onlineGroups, setOnlineGroups] = useState([]);
  const [offlineGroups, setOfflineGroups] = useState([]);
  const [groupImage, setGroupImage] = useState({});

  useEffect(() => {
    // 그룹리스트 가져오기
    getGroupList().then((data) => {
      console.log(data);
      setOnlineGroups(data.onlineGroups || []);
      setOfflineGroups(data.offlineGroups || []);

      // 각 그룹의 이미지 가져오기
      const allGroup = [
        ...(data.onlineGroups || []),
        ...(data.offlineGroups || []),
      ];
      allGroup.forEach((group) => {
        getImage(group.id).then((imageData) => {
          setGroupImage((prevImages) => ({
            ...prevImages,
            [group.id]: URL.createObjectURL(
              new Blob([imageData], { type: "image/png" })
            ),
          }));
        });
      });
    });
  }, []);

  return (
    <>
      {isOnline
        ? onlineGroups.map((group) => (
            <div
              key={group.id}
              className="flex w-full p-2 mb-4 rounded-lg bg-gray-50 shadow-lg"
              onClick={() => navigate(`/group/read/${group.id}`)}
            >
              <div className="w-20 h-20 me-3 rounded-full shadow-lg">
                <div className="w-full h-full text-center overflow-hidden">
                  <img
                    className="w-full h-full rounded-full"
                    src={groupImage[group.id]}
                    alt="groupProfileImage"
                  />
                </div>
              </div>
              <div className="h-20">
                <p className="px-2 pb-1 text-base">{group.title}</p>
                <p className="px-2 pb-1 text-xs">{group.country}</p>
                <div className="flex">
                  <div className="px-2 py-1 bg-emerald-500 text-xs text-white rounded-2xl">
                    {group.category}
                  </div>
                </div>
              </div>
            </div>
          ))
        : offlineGroups.map((group) => (
            <div
              key={group.id}
              className="flex w-full p-2 mb-4 rounded-lg bg-gray-50 shadow-lg"
              onClick={() => navigate(`/group/read/${group.id}`)}
            >
              <div className="w-20 h-20 me-3 rounded-full shadow-lg">
                <div className="w-full h-full text-center overflow-hidden">
                  <img
                    className="w-full h-full rounded-full"
                    src={groupImage[group.id]}
                    alt="groupProfileImage"
                  />
                </div>
              </div>
              <div className="h-20">
                <p className="px-2 pb-1 text-base">{group.title}</p>
                <p className="px-2 pb-1 text-xs">{group.country}</p>
                <div className="flex">
                  <div className="px-2 py-1 bg-emerald-500 text-xs text-white rounded-2xl">
                    {group.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
    </>
  );
};

export default ListComponent;
