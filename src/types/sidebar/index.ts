import { faUsers } from '@fortawesome/free-solid-svg-icons';

export type SideBarItem = {
    itemName: string;
    itemIcon: typeof faUsers;
}

export type SettingModalProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}