import darkUser from '../_assets/Icons/dark-user.svg';
import darkUsers from '../_assets/Icons/dark-users.svg';
import blackEye from '../_assets/Icons/black-eye.svg';
import blackEdit from '../_assets/Icons/black-edit.svg';
import blackTrash from '../_assets/Icons/black-trash.svg';
import blackClose from '../_assets/Icons/dark-close.svg';
import greenClose from '../_assets/Icons/green-close.svg';
import greenSearch from '../_assets/Icons/green-search.svg';
import redWarning from '../_assets/Icons/red-warning.svg';
import blackClock from '../_assets/Icons/black-clock.svg';
import greenDoubleTicks from '../_assets/Icons/green-double-ticks.svg';
import greenEdit from '../_assets/Icons/green-edit.svg';
import greenEye from '../_assets/Icons/green-eye.svg';
import darkTask from '../_assets/Icons/dark-task.svg';
import greenAddTask from '../_assets/Icons/green-add-task.svg';


export const svgs = { 
    getIcons
 };
 const svgsImages ={ 
     "dark_eye_inactive" : blackEye,
     "dark_user_inactive" : darkUser,
     "dark_users_inactive" : darkUsers,
    "black_close_inactive" : blackClose,
    "green_close_active" : greenClose,
    "dark_edit_inactive" : blackEdit,     
    "black-trash_inactive" : blackTrash,
    "green_search_inactive" : greenSearch,    
    "red_warning" : redWarning,  
    "black_clock" : blackClock, 
    "green_double_ticks" : greenDoubleTicks,
    "green_edit" : greenEdit,
    "green_Eye" : greenEye,
    "dark_Task" : darkTask,
    "green_Add_Task" : greenAddTask

 }
 
function getIcons(iconName) {
    return svgsImages[iconName]
}
