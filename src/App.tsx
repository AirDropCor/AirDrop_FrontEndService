import './App.css';
import React, { useState } from 'react';
import SERVER_IP from './config';

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('clipboard');

    const IP = SERVER_IP;

    const handleSendMessage = () => {
        // 使用 fetch 发送 POST 请求
        fetch(`http://${IP}:5230/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // 清空输入框
                setMessage('');
                // 刷新消息列表
                fetchMessages();
            })
            .catch((error) => {
                console.error('发送消息出错：', error);
            });
    };

    const fetchMessages = () => {
        // 使用 fetch 发送 GET 请求
        fetch(`http://${IP}:5230/messages`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // 更新消息列表
                setMessages(data.messages || []);
            })
            .catch((error) => {
                console.error('获取消息出错：', error);
            });
    };

    const handleCopyMessage = (message: string) => {
        // 复制消息到剪贴板
        const el = document.createElement('textarea');
        el.value = message;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('消息已复制到剪贴板');
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages();
        }, 2000);

        // 在组件卸载时清除定时器
        return () => clearInterval(interval);
    }, [fetchMessages]);

    // 页面加载时获取消息列表
    React.useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'clipboard':
                return (
                    <div className="clipboard">
                        <div className="input-container">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="在这里输入你的消息..."
                            />
                            <button onClick={handleSendMessage}>发送消息</button>
                        </div>
                        <h2>剪切板：</h2>
                        <ul>
                            {messages.map((msg, index) => (
                                <li key={index}>
                                    <div className="message-container">
                                        <div className="message-text" title={msg}>
                                            {msg.length > 10 ? msg.slice(0, 10) + '...' : msg}
                                        </div>
                                        <button onClick={() => handleCopyMessage(msg)}>复制消息</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'imageLibrary':
                return <div>图片库内容</div>;
            case 'fileTransfer':
                return <div>文件传输内容</div>;
            default:
                return null;
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="navbar">
                    <button onClick={() => setActiveTab('clipboard')}>剪切板</button>
                    <button onClick={() => setActiveTab('imageLibrary')}>图片库</button>
                    <button onClick={() => setActiveTab('fileTransfer')}>文件传输</button>
                </div>

                {renderTabContent()}
            </header>
        </div>
    );
}
export default App;
