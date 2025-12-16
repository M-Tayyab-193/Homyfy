import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaArrowRight, FaEnvelope, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HELP_CATEGORIES } from '../data/helpData';

function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter content based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return HELP_CATEGORIES;

    const query = searchQuery.toLowerCase();
    
    return HELP_CATEGORIES.map(category => {
      const matchingArticles = category.articles.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.content.toLowerCase().includes(query)
      );

      // Return category if it has matching articles OR if category title matches
      if (matchingArticles.length > 0 || category.title.toLowerCase().includes(query)) {
        return {
          ...category,
          articles: matchingArticles.length > 0 ? matchingArticles : category.articles
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  const toggleArticle = (id) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] pb-12">
      {/* Hero Header */}
      <div className="bg-[#0F1520] text-white py-16 px-4 mb-12">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            How can we help?
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search for help articles (e.g. 'booking', 'cancel', 'listing')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-lg"
            />
          </motion.div>
        </div>
      </div>

      <div className="container-custom max-w-6xl mx-auto px-4">
        {/* Help Categories Grid */}
        {!searchQuery && !activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {HELP_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveCategory(category.id)}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  <category.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4 h-12">
                  {category.description}
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Read Articles <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Article View - Show if searching OR category selected */}
        {(searchQuery || activeCategory) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            {activeCategory && !searchQuery && (
              <button 
                onClick={() => setActiveCategory(null)}
                className="mb-8 flex items-center text-gray-600 hover:text-[#0F1520] font-medium"
              >
                ← Back to Categories
              </button>
            )}

            {searchQuery && (
              <h2 className="text-2xl font-bold mb-8 text-gray-800">
                Search Results for "{searchQuery}"
              </h2>
            )}

            <div className="space-y-8">
              {filteredData
                .filter(cat => !activeCategory || cat.id === activeCategory)
                .map((category) => (
                <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center">
                    <category.icon className="text-blue-600 mr-3 text-xl" />
                    <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {category.articles.map((article) => (
                      <div key={article.id} className="group">
                        <button
                          onClick={() => toggleArticle(article.id)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50/50 transition-colors"
                        >
                          <span className="font-medium text-gray-800 text-lg">{article.title}</span>
                          {expandedArticle === article.id ? (
                            <FaChevronUp className="text-blue-500" />
                          ) : (
                            <FaChevronDown className="text-gray-400 group-hover:text-blue-500" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {expandedArticle === article.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-gray-50"
                            >
                              <div className="p-6 pt-0 text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {article.content}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No results found. Try a different search term.</p>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Contact Support Footer */}
        <div className="mt-20 text-center border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-8">Our support team is available 24/7 to assist you.</p>
          <a 
            href="mailto:support@homyfy.com"
            className="inline-flex items-center px-8 py-3 bg-[#0F1520] text-white rounded-full font-medium hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaEnvelope className="mr-3" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterPage;