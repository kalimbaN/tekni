import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/category/${category.slug}`)}
            className="bg-white rounded-lg p-4 text-center shadow hover:shadow-lg transition cursor-pointer group"
        >
            <div className="text-4xl mb-2 group-hover:scale-110 transition">
                {category.icon}
            </div>
            <div className="font-semibold text-sm">{category.name}</div>
            <div className="text-xs text-gray-500">{category.count} items</div>
        </div>
    );
};

export default CategoryCard;