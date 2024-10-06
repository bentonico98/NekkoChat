import avatar from "../../assets/avatar.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faBars } from '@fortawesome/free-solid-svg-icons';

import { Stack, Image, Button} from "react-bootstrap";

export default function ProfileHeader() {
    return (
        <Stack direction="horizontal" gap={3} >
            <Image src={avatar} roundedCircle fluid width={50} className="p-2" />
            <div className="ms-auto">
                <Button type="submit" variant="light" className="m-2"  >{<FontAwesomeIcon icon={faAdd} />}</Button>
                <Button type="submit" variant="light" className="m-2" >{<FontAwesomeIcon icon={faBars} />}</Button>
            </div>
        </Stack>
    );
}