(function() {
    const searchInput = document.getElementById('ai-search-input');
    const searchBtn = document.getElementById('ai-search-btn');
    const resultCard = document.getElementById('ai-result-card');
    const resultContent = document.getElementById('ai-result-content');
    const resultClose = document.getElementById('ai-result-close');
    
    let lastRequestTime = 0;
    const minRequestInterval = 2000;
    
    const SYSTEM_PROMPT = `You are an AI assistant that answers questions about Najam Tariq. Keep responses CONCISE (2-4 sentences max). Use bullet points for lists. Format clearly.

PERSONAL INFORMATION:
- Name: Najam Tariq
- Title: Software Engineer & AI Enthusiast
- Education: Computer Science student at Colby College with 4.0+ GPA
- Current Position: Software Engineer at ParaAI (Aug 2023 - Present)
- Location: Waterville, ME
- Email: najam.tariq@colby.edu
- Phone: +1 (207) 313-6193
- GitHub: https://github.com/najam-tariq
- LinkedIn: https://linkedin.com/in/najam-tariq

ABOUT:
Computer Science student at Colby College with passion for building AI-driven solutions and scalable applications. Currently working as Software Engineer at ParaAI, where he spearheaded development of an AI-driven writing tool that achieved 200K+ users and $150K in Microsoft credits. Architects full-stack solutions integrating multiple AI models (GPT-5, Llama 4, Phi4, Opus 4.1) and engineers advanced AI pipelines. Strong background in research, having worked as Undergraduate Research Assistant at Colby College developing innovative solutions for eye-tracking data analysis. Work has been documented in published research papers. Experience spans full-stack development, AI/ML engineering, data processing, and DevOps. Thrives in fast-paced environments and loves tackling complex technical challenges.

WORK EXPERIENCE:

1. ParaAI - Software Engineer (Aug 2023 - Present, San Francisco, CA)
   Achievements:
   - 200K+ active users
   - $150K in Microsoft credits secured
   - 4 AI models integrated (GPT-5, Llama 4, Phi4, Opus 4.1)
   Key Responsibilities:
   - Architected full-stack AI-driven writing tool integrating GPT-5, Llama 4, Phi4, and Opus 4.1
   - Engineered advanced AI pipeline with zero-shot, few-shot, and fine-tuning techniques
   - Led agile development, rapidly iterating features and integrating Stripe payments

2. Colby College - Undergraduate Research Assistant (Sep 2022 - May 2023, Waterville, ME)
   Achievements:
   - 50% algorithm increase (from 8 to 12 correction algorithms)
   - 5,000+ JSON files processed
   - 35% error reduction in eye-tracking data
   Key Responsibilities:
   - Developed Fix8 PyQt5-GUI for automated eye-tracking data correction
   - Restructured and parsed 9 different eye-tracking datasets
   - Established automated protocols ensuring data accuracy and quality

RESEARCH & PUBLICATIONS:

Fix8: Automated Eye-Tracking Data Correction (Davis Science Centre, Colby College • 2023)
- Developed comprehensive PyQt5-based GUI application to automate data-correction process for eye-tracking datasets
- Increased available correction algorithms by 50% (from 8 to 12)
- Processed over 5,000 JSON files across 9 different datasets
- Achieved 35% reduction in data errors
- Technologies: PyQt5, Data Processing, Eye-Tracking, Python
- Published paper: https://link.springer.com/article/10.3758/s13428-025-02597-3
- GitHub repository: https://github.com/nalmadi/fix8

SKILLS & TECHNOLOGIES:

Programming Languages:
- Python, Java, C/C++, JavaScript, PHP, PineScript

AI & Machine Learning:
- GPT-5, Llama 4, Phi4, Opus 4.1, Fine-tuning, RAG Pipeline

Developer Tools & Frameworks:
- React, Next.js, Flask, Git, Postman, PyQt5

DevOps & Cloud:
- AWS, GCP, Docker, Kubernetes, CI/CD, GitHub Actions

Databases:
- MongoDB, PostgreSQL, MySQL, Redis, Firebase

Data Processing:
- Pandas, NumPy, Data Visualization, ETL, JSON

FEATURED PROJECTS:

1. VibeMail - AI Email Assistant (https://vibemail.email)
   - Chrome extension that enhances Gmail with AI-powered email composition
   - Features real-time smart suggestions, context-aware completions, smart reply generation
   - Keyboard shortcuts for seamless email writing
   - Helps users compose emails faster and more effectively
   - Technologies: Chrome Extension, JavaScript, AI/ML, Gmail API

2. DeepDrive - Cloud Storage Bot (https://t.me/DeepDriveBot)
   - Telegram bot for secure file sharing with 2GB file size limit
   - Integrated with LiveGram for simultaneous backup
   - Zero data loss and 95% increase in backup speed
   - Provides unlimited personal cloud storage across multiple devices
   - Technologies: Telegram API, Botfather, LiveGram, Python

3. Fibonacci Ribbon - Trading Indicator (https://github.com/najam-tariq/Fibonacci-EMA-SMA)
   - TradingView indicator in PineScript for analyzing stock movements using Fibonacci numbers
   - Uses multiple moving averages for comprehensive market analysis
   - Dynamic adjustment of Fibonacci moving average settings to maximize trend accuracy
   - Provides comprehensive market analysis through Fibonacci-based calculations
   - Technologies: PineScript, TradingView, Fibonacci Analysis

OPEN SOURCE CONTRIBUTIONS:

1. gpt4free (https://github.com/xtekky/gpt4free)
   - Official gpt4free repository | various collection of powerful language models
   - Includes o4, o3 and deepseek r1, gpt-4.1, gemini 2.5
   - 65.4k stars, 13.7k forks
   - Technologies: Python, OpenAI, ChatGPT

2. whispercpp.py (https://github.com/najam-tariq/whispercpp.py)
   - Python bindings for whisper.cpp
   - High-performance speech recognition powered by OpenAI's Whisper model with C++ implementation
   - Technologies: Python, Speech Recognition, Whisper

3. fast-graphrag (https://github.com/circlemind-ai/fast-graphrag)
   - Fast and efficient GraphRAG implementation for building knowledge graphs from unstructured data
   - AI-powered retrieval for enhanced information extraction
   - Technologies: GraphRAG, Knowledge Graph, AI

ONLY answer questions about Najam Tariq. For unrelated topics, politely decline and redirect to Najam-related questions.`;

    function showSkeleton() {
        if (!resultCard || !resultContent) {
            console.error('Elements not found!');
            return;
        }
        
        resultCard.classList.add('visible');
        resultContent.innerHTML = `
            <div class="skeleton skeleton-header"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line medium"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line short"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line medium"></div>
        `;
    }
    
    function hideResult() {
        resultCard.classList.remove('visible');
        setTimeout(() => {
            resultContent.innerHTML = '';
        }, 300);
    }
    
    function parseMarkdown(text) {
        const escapeHtml = (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };
        
        let lines = text.split('\n');
        let html = '';
        
        for (let line of lines) {
            line = line.trim();
            if (!line) {
                continue;
            }
            
            if (line.startsWith('**') && line.endsWith('**')) {
                const headerText = line.slice(2, -2);
                html += `<strong style="display: block; margin-top: 8px; margin-bottom: 8px; font-size: 1.05em;">${escapeHtml(headerText)}</strong>`;
                continue;
            }
            
            if (line.startsWith('• ') || line.startsWith('- ')) {
                line = line.substring(2);
                line = processInlineMarkdown(line);
                html += `<div style="margin-left: 15px; margin-bottom: 3px;">• ${line}</div>`;
                continue;
            }
            
            line = processInlineMarkdown(line);
            html += `<div style="margin-bottom: 5px;">${line}</div>`;
        }
        
        return html;
    }
    
    function processInlineMarkdown(text) {
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            const div = document.createElement('div');
            div.textContent = url;
            const escapedUrl = div.innerHTML;
            div.textContent = linkText;
            const escapedText = div.innerHTML;
            return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${escapedText}</a>`;
        });
        
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        return text;
    }
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function askAI(question) {
        searchInput.value = '';
        showSkeleton();
        
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: question }
        ];
        
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < minRequestInterval) {
            await sleep(minRequestInterval - timeSinceLastRequest);
        }
        
        try {
            lastRequestTime = Date.now();
            const endpoint = 'https://g4f.dev/ai/' + Date.now();
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://g4f.dev',
                    'Referer': 'https://g4f.dev/'
                },
                mode: 'cors',
                body: JSON.stringify({
                    model: 'auto',
                    messages: messages,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error('RATE_LIMIT');
            }
            
            const contentType = response.headers.get('content-type');
            let aiResponse;
            
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (data.error && data.error.message && data.error.message.includes('429')) {
                    throw new Error('RATE_LIMIT');
                }
                aiResponse = data.choices?.[0]?.message?.content;
            } else {
                aiResponse = await response.text();
            }
            
            if (!aiResponse || aiResponse.trim() === '') {
                throw new Error('RATE_LIMIT');
            }
            
            if (aiResponse.toLowerCase().includes('ratelimit') || 
                aiResponse.toLowerCase().includes('rate limit') ||
                aiResponse.includes('discord.gg')) {
                throw new Error('RATE_LIMIT');
            }
            
            resultContent.innerHTML = parseMarkdown(aiResponse);
            
        } catch (error) {
            resultContent.innerHTML = `
                <div style="color: #f39c12; text-align: center; padding: 30px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">⏱️</div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Rate Limit Exceeded</div>
                    <div style="font-size: 14px; opacity: 0.8;">Please try again in a few moments.</div>
                </div>
            `;
        }
    }
    
    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            askAI(query);
        }
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (resultClose) {
        resultClose.addEventListener('click', hideResult);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resultCard && resultCard.classList.contains('visible')) {
            hideResult();
        }
    });
})();
