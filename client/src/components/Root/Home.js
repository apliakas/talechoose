import React from 'react';

import { Link } from 'react-router-dom';

import icon from '../../static/icon.png';

const Home = (props) => {
  return (
    <div className='columns is-centered my-6 has-text-centered mx-2'>
      <div className='column is-three-fifths-desktop is-four-fifths-tablet is-full-mobile p-6 border-gray box'>
        <img src={icon} className="mb-4"></img>
        <h1 className='title mb-4'>Create your own adventure</h1>
        <p className='has-text-justified mb-6'>
          Have you ever get frustrated because the main character from a book you love is doing something stupid? Now you can be that character and make that stupid decision (among others).<br/> On --Name under construction-- you can create stories where to take decisions that lead to different paths and endings so the reader will be playing your book. You can also play other people's books, --Name under construction-- is both a place where to create your game books and where to read yours or other people's ones. Turn your children into heroes, your friends into adventurers or anything you can think of, there is no limit.
        </p>
        <Link to={props.user ? '/books' : '/signup'} className="button is-info">
          <strong>{props.user ? 'Search for an' : 'Start your'} Adventure</strong>
        </Link>
      </div>
    </div>
  );
};

export default Home;