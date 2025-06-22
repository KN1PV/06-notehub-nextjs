'use client'

import css from './NotesPage.module.css'
import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteModal from '@/components/NoteModal/NoteModal';
import { fetchNotes } from '@/lib/api';

const NotesClient = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
    const { data } = useQuery({
        queryKey: ['notes', debouncedSearchQuery, currentPage],
        queryFn: () => fetchNotes(debouncedSearchQuery || '', currentPage),
        placeholderData: keepPreviousData,
    });
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const notes = data?.notes;
    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox searchQuery={searchQuery} onChange={handleSearch} />
                {data && data.totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        totalPages={data.totalPages}
                    />
                )}
                <button className={css.button} onClick={openModal}>
                    Create note +
                </button>
            </header>
            {notes && notes.length > 0 && <NoteList notes={notes} />}
            {isModalOpen && <NoteModal onClose={closeModal} />}
        </div>
    );
};

export default NotesClient;