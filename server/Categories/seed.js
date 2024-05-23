const Categories = require('./Categories');

const data = [
    'Прогнозы в IT',
    'Веб-разработка',
    'Мобильная разработка',
    'Фриланс',
    'Алгоритмы',
    'Тестирование IT-систем',
    'Разработка игр',
    'Дизайн и юзабилити',
    'Искусственный интеллект',
    'Машинное обучение'
];

async function writeDataCategory(){
    const length = await Categories.count();
    if(length == 0){
        data.map((item, index) => {
            new Categories({
                name: item,
                key: index
            }).save();
        });
    }
    console.log(length);
}

module.exports = writeDataCategory;