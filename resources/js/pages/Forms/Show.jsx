import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GuestLayout from '@/layouts/GuestLayout';
import MultiSelectQuestion from '@/components/forms/MultiSelectQuestion';
import SingleSelectQuestion from '@/components/forms/SingleSelectQuestion';
import SliderQuestion from '@/components/forms/SliderQuestion';
import ImageSelectQuestion from '@/components/forms/ImageSelectQuestion';
import CallbackModal from '@/components/forms/CallbackModal';

export default function FormShow({ form }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const totalSteps = form.questions.length;
  const currentQuestion = form.questions[currentStep];
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const { data, setData, post, processing } = useForm({
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
    post(route('forms.submit', form.slug));
  };

  const handleAnswerChange = (questionId, answer) => {
    setData('responses', {
      ...data.responses,
      [questionId]: answer,
    });
  };

  const canProceed = () => {
    if (!currentQuestion.is_required) return true;
    const answer = data.responses[currentQuestion.id];

    if (currentQuestion.type === 'multiselect') {
      return Array.isArray(answer) && answer.length > 0;
    }

    return answer !== undefined && answer !== null && answer !== '';
  };

  return (
    <GuestLayout>
      <Head title={form.title} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm font-medium text-gray-700">{progress}% komplett</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-gray-600">{currentQuestion.subtitle}</p>
              )}
            </div>

            {/* Callback CTA */}
            <div className="bg-blue-600 text-white rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Föredrar du att prata direkt?</p>
                  <p className="text-sm text-blue-100">Vi ringer upp dig istället</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowCallbackModal(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Boka samtal
                </Button>
              </div>
            </div>

            {/* Question Content */}
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
                  value={data.responses[currentQuestion.id] || currentQuestion.config?.min || 0}
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
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
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
        </div>
      </div>

      <CallbackModal
        open={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
      />
    </GuestLayout>
  );
}
