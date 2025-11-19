import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MultiSelectQuestion from '@/components/forms/MultiSelectQuestion';
import SingleSelectQuestion from '@/components/forms/SingleSelectQuestion';
import SliderQuestion from '@/components/forms/SliderQuestion';
import ImageSelectQuestion from '@/components/forms/ImageSelectQuestion';
import ContactFieldQuestion from '@/components/forms/ContactFieldQuestion';
import CallbackModal from '@/components/forms/CallbackModal';

export default function FormSlideIn({ open, onClose, form }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const totalSteps = form?.questions?.length || 0;
  const currentQuestion = form?.questions?.[currentStep];
  const progress = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  const { data, setData, post, processing, reset } = useForm({
    responses: {},
  });

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    post(route('forms.submit', form.slug), {
      onSuccess: () => {
        reset();
        setCurrentStep(0);
        onClose();
      },
    });
  };

  const handleAnswerChange = (questionId, answer) => {
    setData('responses', {
      ...data.responses,
      [questionId]: answer,
    });
  };

  const canProceed = () => {
    if (!currentQuestion?.is_required) return true;
    const answer = data.responses[currentQuestion.id];

    if (currentQuestion.type === 'multiselect') {
      return Array.isArray(answer) && answer.length > 0;
    }

    return answer !== undefined && answer !== null && answer !== '';
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setCurrentStep(0);
      reset();
      onClose();
    }
  };

  if (!form || !currentQuestion) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-8 sm:p-10">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl">{form.title}</SheetTitle>
            {form.description && (
              <SheetDescription>{form.description}</SheetDescription>
            )}
          </SheetHeader>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm font-medium text-gray-700">{progress}% komplett</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Content */}
          <div className="mb-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentQuestion.title}
              </h3>
              {currentQuestion.subtitle && (
                <p className="text-gray-600">{currentQuestion.subtitle}</p>
              )}
            </div>

            {/* Callback CTA */}
            <div className="bg-blue-600 text-white rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Föredrar du att prata direkt?</p>
                  <p className="text-sm text-blue-100">Vi ringer upp dig istället</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowCallbackModal(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap"
                >
                  Boka samtal
                </Button>
              </div>
            </div>

            {/* Question */}
            <div>
              {currentQuestion.type === 'multiselect' && (
                <MultiSelectQuestion
                  question={currentQuestion}
                  value={data.responses[currentQuestion.id] || []}
                  onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                />
              )}

              {currentQuestion.type === 'single_select' && (
                <SingleSelectQuestion
                  question={currentQuestion}
                  value={data.responses[currentQuestion.id] || ''}
                  onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                />
              )}

              {currentQuestion.type === 'slider' && (
                <SliderQuestion
                  question={currentQuestion}
                  value={data.responses[currentQuestion.id] || currentQuestion.config?.default || currentQuestion.config?.min || 0}
                  onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                />
              )}

              {currentQuestion.type === 'image_select' && (
                <ImageSelectQuestion
                  question={currentQuestion}
                  value={data.responses[currentQuestion.id] || ''}
                  onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                />
              )}

              {['text', 'email', 'phone', 'textarea'].includes(currentQuestion.type) && (
                <ContactFieldQuestion
                  question={currentQuestion}
                  value={data.responses[currentQuestion.id] || ''}
                  onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || processing}
              className="flex items-center bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === totalSteps - 1 ? (
                processing ? 'Skickar...' : form.submit_button_text
              ) : (
                <>
                  Nästa
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <CallbackModal
        open={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
      />
    </>
  );
}
