import React, { useState, useEffect } from 'react';
import './Email.css';
import inboxData from '../inbox.json';
import spamData from '../spam.json';

const Email = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox'); 
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFolders = () => {
      const foldersData = [
        { id: 'inbox', name: 'Inbox' },
        { id: 'spam', name: 'Spam' },
        { id: 'deleted', name: 'Deleted Items' },
        { id: 'custom', name: 'Custom Folder' },
      ];
      setFolders(foldersData);
    };

    const loadEmails = () => {
      const inboxEmails = inboxData.map(email => ({ ...email, folder: 'inbox', unread: true }));
      const spamEmails = spamData.map(email => ({ ...email, folder: 'spam', unread: true }));
      setEmails([...inboxEmails, ...spamEmails]);
    };

    loadFolders();
    loadEmails();
  }, []);

  const getUnreadCount = folderId => {
    return emails.filter(email => email.folder === folderId && email.unread).length;
  };

  const selectFolder = folderId => {
    setSelectedFolder(folderId);
    setSelectedEmail(null);
  };

  const selectEmail = emailId => {
    const updatedEmails = emails.map(email => {
      if (email.mId === emailId && email.unread) {
        return { ...email, unread: false };
      }
      return email;
    });
    setEmails(updatedEmails);
    setSelectedEmail(emailId);

    const selectedEmailElement = document.querySelector('.email-item.selected .email-subject');
    if (selectedEmailElement) {
      selectedEmailElement.classList.remove('unread');
    }
  };

  const deleteEmail = emailId => {
    const updatedEmails = emails.map(email => {
      if (email.mId === emailId) {
        return { ...email, folder: 'deleted' };
      }
      return email;
    });
    setEmails(updatedEmails);
    setSelectedEmail(null);
  };

  const flagEmail = emailId => {
    const updatedEmails = emails.map(email => {
      if (email.mId === emailId) {
        return { ...email, flagged: true };
      }
      return email;
    });
    setEmails(updatedEmails);
  };

  const searchEmails = () => {
    const filteredEmails = emails.filter(
      email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredEmails;
  };

  const handleSearchInputChange = e => {
    setSearchTerm(e.target.value);
  };

  const renderEmailList = () => {
    const filteredEmails = searchTerm ? searchEmails() : emails;
    const selectedFolderEmails = filteredEmails.filter(
      email => email.folder === selectedFolder
    );

    return selectedFolderEmails.map(email => (
      <div
        key={email.mId}
        className={`email-item ${selectedEmail === email.mId ? 'selected' : ''}`}
        onClick={() => selectEmail(email.mId)}
      >
        <div className={`email-subject ${email.unread ? 'unread' : ''}`}>
          {email.flagged && <span className="flag-icon">&#9873;</span>}
          {email.subject}
        </div>
        <div className="email-preview">
          {email.content.substring(0, 50)}
          {email.content.length > 50 && '...'}
        </div>
      </div>
    ));
  };

  const handleBackButtonClick = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="email-client">
      <div className="folders">
        {folders.map(folder => (
          <div
            key={folder.id}
            className={`folder ${selectedFolder === folder.id ? 'selected' : ''}`}
            onClick={() => selectFolder(folder.id)}
          >
            {folder.name}
            {folder.id !== 'deleted' && (
              <span className="unread-count">{getUnreadCount(folder.id)}</span>
            )}
          </div>
        ))}
      </div>
      <div className="email-list">
        {selectedEmail ? (
          <div className="email-details">
            <div className="email-header">
              <h3>{emails.find(email => email.mId === selectedEmail).subject}</h3>
              <button onClick={() => deleteEmail(selectedEmail)}>Delete</button>
              <button onClick={() => flagEmail(selectedEmail)}>Flag</button>
              <button onClick={handleBackButtonClick}>Back</button>
            </div>
            <div className="email-content">
              {emails.find(email => email.mId === selectedEmail).content}
            </div>
          </div>
        ) : (
          renderEmailList()
        )}
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>
    </div>
  );
};

export default Email;