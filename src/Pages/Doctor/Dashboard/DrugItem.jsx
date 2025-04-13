import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QuantityControl from '../../../Components/QuantityControl/QuantityControl';
import styles from './DrugItem.module.scss';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const DrugItem = ({ drug, onAdd }) => {
    const [quantity, setQuantity] = useState(1);
    const handleChangeQuantity = (quantity) => {
        setQuantity(quantity);
    }

    return (
        <div className={styles.drugItem}>
            <div className={styles.drugItem__details}>
                <p>{drug.name}</p>
                <p>{drug.brand} - {drug.type.name}</p>
            </div>
            <div className={styles.drugItem__quantity}>
                <QuantityControl value={quantity} onChange={handleChangeQuantity}/>
                <button className={styles.drugItem__button} onClick={() => onAdd(drug._id, quantity)}>
                    <FontAwesomeIcon icon={faFileCirclePlus} size='xl' />
                </button>
            </div>
        </div>
    );
}

export default DrugItem;