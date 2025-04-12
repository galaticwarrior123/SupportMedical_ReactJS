import styles from './DrugItem.module.scss';

const DrugItem = ({ drug }) => {

    return (
        <div className={styles.drugItem}>
            <div className={styles.drugItem__details}>
                <p>{drug.name}</p>
                <p>{drug.brand} - {drug.type.name}</p>
            </div>
        </div>
    );
}

export default DrugItem;