

import ProfileIcon from "../ProfileIcon";


interface RequestProps{
    username:string
    avatar:string | null
    key: string
}



export default function Request({username,avatar,key}:RequestProps){
    return(
        <div className="flex items-center justify-between rounded-lg bg-primary5 p-3" key={key}>
            <ProfileIcon username={username} avatar={avatar}/>
            <div className="flex items-center gap-3">
                <button className="rounded-lg bg-correct3 hover:brightness-115 transition-all text-grey1 py-2 px-6 text-center cursor-pointer">Accept</button>
                <button className="rounded-lg bg-error3 hover:brightness-115 transition-all text-grey1 py-2 px-6 text-center cursor-pointer">Decline</button>
            </div>
        </div>
    )
}