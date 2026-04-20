import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5; // Max page numbers to show

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + showMax - 1);

            if (end === totalPages) {
                start = Math.max(1, end - showMax + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 ${
                    currentPage === 1 
                        ? 'opacity-30 cursor-not-allowed text-gray-400' 
                        : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-90'
                }`}
            >
                <FiChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5 px-2 bg-gray-50/50 dark:bg-gray-900/50 py-1.5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                            currentPage === page
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 ${
                    currentPage === totalPages 
                        ? 'opacity-30 cursor-not-allowed text-gray-400' 
                        : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-90'
                }`}
            >
                <FiChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
