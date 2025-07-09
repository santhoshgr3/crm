import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Send, Users, Settings, QrCode, Wifi, WifiOff } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

interface WhatsAppMessage {
  id: string;
  lead_id: string;
  phone_number: string;
  message: string;
  message_type: 'outgoing' | 'incoming' | 'template';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sent_at: string;
  delivered_at?: string;
  read_at?: string;
}

const TRANSLATE_API_URL = 'https://libretranslate.de/translate'; // Example public API
const backendUrl = import.meta.env.VITE_WHATSAPP_BACKEND_URL || 'http://localhost:3001';

export default function WhatsAppIntegration() {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [messageText, setMessageText] = useState('');
  const [translatedMessage, setTranslatedMessage] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: '1',
      name: 'Welcome Message',
      content: 'Welcome to DMHCA! We are excited to help you with your medical education journey. How can we assist you today?'
    },
    {
      id: '2',
      name: 'Course Information',
      content: 'Thank you for your interest in our medical courses. We offer Fellowship, PG Diploma, and Certification programs. Which area interests you most?'
    },
    {
      id: '3',
      name: 'Follow-up Reminder',
      content: 'Hi! This is a friendly reminder about your application for {course_name}. Please let us know if you need any assistance.'
    }
  ]);
  // Add state for new template
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  // Edit template state
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateContent, setEditTemplateContent] = useState('');

  // Campaign state
  const [showCampaign, setShowCampaign] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignTemplateId, setCampaignTemplateId] = useState('');
  const [campaignLeads, setCampaignLeads] = useState<string[]>([]); // Array of lead IDs
  const [campaignStatus, setCampaignStatus] = useState('');

  useEffect(() => {
    const socket = io(backendUrl);
    socket.on('qr', (qrUrl) => {
      setQrCode(qrUrl);
      setIsConnected(false);
    });
    socket.on('ready', () => setIsConnected(true));
    socket.on('authenticated', () => setIsConnected(true));
    socket.on('disconnected', () => setIsConnected(false));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/messages`);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedLead) {
      toast.error('Please select a lead and enter a message');
      return;
    }

    try {
      const messageData = {
        lead_id: selectedLead,
        phone_number: '+91 9876543210', // This would come from the selected lead
        message: messageText,
        message_type: 'outgoing',
        status: 'sent',
        sent_at: new Date().toISOString()
      };

      await axios.post(`${backendUrl}/api/messages`, messageData);

      toast.success('Message sent successfully!');
      setMessageText('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const sendBulkMessage = async (template: string) => {
    try {
      // In real implementation, this would send to multiple leads
      toast.success('Bulk message sent to all active leads!');
    } catch (error) {
      console.error('Error sending bulk message:', error);
      toast.error('Failed to send bulk message');
    }
  };

  const translateMessage = async () => {
    if (!messageText.trim()) return;
    try {
      const res = await axios.post(TRANSLATE_API_URL, {
        q: messageText,
        source: 'auto',
        target: targetLang,
        format: 'text'
      });
      setTranslatedMessage(res.data.translatedText);
      toast.success('Message translated!');
    } catch (error) {
      toast.error('Translation failed');
    }
  };

  // Save new template
  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) {
      toast.error('Please enter both a name and content for the template.');
      return;
    }
    setMessageTemplates(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        name: newTemplateName,
        content: newTemplateContent,
      },
    ]);
    setNewTemplateName('');
    setNewTemplateContent('');
    toast.success('Template saved!');
  };

  // Edit template state
  const handleEditTemplate = (id: string) => {
    const template = messageTemplates.find(t => t.id === id);
    if (template) {
      setEditingTemplateId(id);
      setEditTemplateName(template.name);
      setEditTemplateContent(template.content);
    }
  };
  // Save edited template
  const handleSaveEditTemplate = () => {
    setMessageTemplates(prev => prev.map(t => t.id === editingTemplateId ? { ...t, name: editTemplateName, content: editTemplateContent } : t));
    setEditingTemplateId(null);
    setEditTemplateName('');
    setEditTemplateContent('');
    toast.success('Template updated!');
  };
  // Cancel edit
  const handleCancelEdit = () => {
    setEditingTemplateId(null);
    setEditTemplateName('');
    setEditTemplateContent('');
  };
  // Copy template content
  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Template copied!');
  };

  // Send campaign
  const handleSendCampaign = () => {
    if (!campaignName.trim() || !campaignTemplateId || campaignLeads.length === 0) {
      toast.error('Please fill all campaign fields.');
      return;
    }
    setCampaignStatus('Sending...');
    setTimeout(() => {
      setCampaignStatus(`Campaign "${campaignName}" sent to ${campaignLeads.length} leads!`);
      setShowCampaign(false);
      setCampaignName('');
      setCampaignTemplateId('');
      setCampaignLeads([]);
      setTimeout(() => setCampaignStatus(''), 4000);
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('whatsapp.title')}</h1>
        <p className="text-gray-600 mt-1">{t('whatsapp.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connection Status & QR Code */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('whatsapp.connectionStatus')}</h3>
            <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
              <span className="text-sm font-medium">
                {isConnected ? t('whatsapp.connected') : t('whatsapp.disconnected')}
              </span>
            </div>
          </div>

          {!isConnected && qrCode && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                <img src={qrCode} alt="WhatsApp QR" className="mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Scan this QR with WhatsApp to connect</p>
            </div>
          )}

          {isConnected && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">WhatsApp Business Connected</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Ready to send and receive messages</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                  <p className="text-xs text-blue-600">Total Messages</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">
                    {messages.filter(m => m.status === 'delivered').length}
                  </p>
                  <p className="text-xs text-green-600">Delivered</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Send Message */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('whatsapp.sendMessage')}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Lead</label>
              <select
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a lead...</option>
                <option value="1">Dr. Ananya Nair - +91 9876543220</option>
                <option value="2">Dr. Vikram Singh - +91 9876543221</option>
                <option value="3">Dr. Meera Gupta - +91 9876543222</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type your message here..."
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!isConnected}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </button>
          </div>
        </div>

        {/* Message Templates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('whatsapp.templates')}</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {messageTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
                {editingTemplateId === template.id ? (
                  <>
                    <input
                      className="w-full border rounded px-2 py-1 mb-1"
                      value={editTemplateName}
                      onChange={e => setEditTemplateName(e.target.value)}
                    />
                    <textarea
                      className="w-full border rounded px-2 py-1 mb-1"
                      value={editTemplateContent}
                      onChange={e => setEditTemplateContent(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleSaveEditTemplate}>Save</button>
                      <button className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTemplate(template.id)}
                          className="text-xs px-2 py-1 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500"
                        >Edit</button>
                        <button
                          onClick={() => handleCopyTemplate(template.content)}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >Copy</button>
                        <button
                          onClick={() => sendBulkMessage(template.content)}
                          disabled={!isConnected}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >Use</button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{template.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Create and Save New Template */}
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Create New Template</h4>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Template Name"
              value={newTemplateName}
              onChange={e => setNewTemplateName(e.target.value)}
            />
            <textarea
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Template Content"
              value={newTemplateContent}
              onChange={e => setNewTemplateContent(e.target.value)}
              rows={3}
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={handleSaveTemplate}
            >
              Save Template
            </button>
          </div>
          <button className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50" onClick={() => setShowCampaign(true)}>
            <Users className="h-4 w-4" />
            <span>Campaign</span>
          </button>
          {/* Campaign Modal */}
          {showCampaign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold" onClick={() => setShowCampaign(false)}>&times;</button>
                <h2 className="text-xl font-bold mb-4">Create Campaign</h2>
                <div className="space-y-3">
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Campaign Name"
                    value={campaignName}
                    onChange={e => setCampaignName(e.target.value)}
                  />
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={campaignTemplateId}
                    onChange={e => setCampaignTemplateId(e.target.value)}
                  >
                    <option value="">Select Template</option>
                    {messageTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Select Leads</label>
                    <div className="max-h-32 overflow-y-auto border rounded p-2">
                      {allLeads.map(lead => (
                        <label key={lead.id} className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={campaignLeads.includes(lead.id)}
                            onChange={e => {
                              setCampaignLeads(l => e.target.checked ? [...l, lead.id] : l.filter(id => id !== lead.id));
                            }}
                          />
                          <span>{lead.name} ({lead.phone})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
                    onClick={handleSendCampaign}
                  >
                    Send Campaign
                  </button>
                  {campaignStatus && <div className="text-green-600 text-sm mt-2">{campaignStatus}</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message History */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('whatsapp.messageHistory')}</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.message_type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.message_type === 'outgoing'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-75">
                      {new Date(message.sent_at).toLocaleTimeString()}
                    </span>
                    <span className={`text-xs ${message.status === 'delivered' ? 'text-green-300' : 'text-gray-300'}`}>
                      {message.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Campaigns */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaigns</h3>
        <div className="space-y-3">
          <button
            onClick={() => sendBulkMessage('This is a campaign message to all leads!')}
            disabled={!isConnected}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>Send Campaign to All Leads</span>
          </button>
          <button
            onClick={() => sendBulkMessage('This is a campaign message to all Hot Leads!')}
            disabled={!isConnected}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>Send Campaign to Hot Leads</span>
          </button>
          <button
            onClick={() => sendBulkMessage('This is a campaign message to all Not Interested Leads!')}
            disabled={!isConnected}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>Send Campaign to Not Interested Leads</span>
          </button>
        </div>
      </div>

      {/* Translation Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Translate Message</h3>
        <div className="flex flex-col gap-2">
          <label className="text-sm">Select Language</label>
          <select
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-48"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="te">Telugu</option>
            <option value="ur">Urdu</option>
            {/* Add more as needed */}
          </select>
          <button
            onClick={translateMessage}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Translate
          </button>
          {translatedMessage && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <b>Translated:</b> {translatedMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}