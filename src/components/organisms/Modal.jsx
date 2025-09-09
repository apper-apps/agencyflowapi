import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
<motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/20 transition-all sm:w-full sm:max-w-2xl border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
<div className="bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-xl px-6 pb-6 pt-6 sm:p-8 sm:pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                      {title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="X"
                      onClick={onClose}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
                    />
                  </div>
                  <div className="mt-4">
                    {children}
                  </div>
                </div>
                {actions && (
<div className="bg-gradient-to-r from-slate-50/95 to-white/95 backdrop-blur-xl px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8 border-t border-slate-200/60">
                    <div className="flex space-x-3">
                      {actions}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal