import { useState } from 'react';
import { Room } from '../../types/data'
import style from "../input/dropDown.module.scss";

interface Props {
   setChatRoom: React.Dispatch<React.SetStateAction<Room | undefined>>
   chatRoom: Room | undefined
   rooms: Room[] | undefined
   openRoom : (id: number)=> void
}

function DropDown(props: Props) {
   const { chatRoom, setChatRoom, rooms,openRoom } = props


   const [show, setShow] = useState(false)


   return (
      <div className={style.dropDown}>
         <div className={style.dropDown_current}>
            <p className={style.dropDown_current_title}>{chatRoom?.title}</p>
            <img onClick={() => setShow(!show)} style={show ? { transform: 'rotateX(360deg)' } : undefined} src='../images/triangle.png' />
         </div>
         {
            show && <div className={style.dropDown__list}>
               {
                  rooms?.map(item =>
                     <div onClick={()=>{openRoom(item.id)
                        setShow(false)
                     }} className={style.dropDown__list_item}>
                        <p>{item.title}</p>
                     </div>
                  )
               }

            </div>
         }

      </div>
   )
}

export default DropDown
