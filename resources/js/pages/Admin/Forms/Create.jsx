import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, ArrowLeft } from 'lucide-react';
import IconSelector from '@/components/forms/IconSelector';

export default function FormCreate() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    slug: '',
    description: '',
    success_message: '',
    submit_button_text: 'Skicka',
    is_active: true,
    questions: [],
  });

  const addQuestion = () => {
    setData('questions', [
      ...data.questions,
      {
        title: '',
        subtitle: '',
        image_url: '',
        type: 'single_select',
        config: {},
        order: data.questions.length + 1,
        is_required: true,
        options: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = data.questions.filter((_, i) => i !== index);
    setData('questions', newQuestions.map((q, i) => ({ ...q, order: i + 1 })));
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...data.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setData('questions', newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...data.questions];
    newQuestions[questionIndex].options.push({
      label: '',
      description: '',
      icon: '',
      image_url: '',
      order: newQuestions[questionIndex].options.length + 1,
    });
    setData('questions', newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...data.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options
      .filter((_, i) => i !== optionIndex)
      .map((o, i) => ({ ...o, order: i + 1 }));
    setData('questions', newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...data.questions];
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      [field]: value,
    };
    setData('questions', newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.forms.store'));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/å/g, 'a')
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <AdminLayout title="Skapa formulär">
      <Head title="Skapa formulär" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.visit(route('admin.forms.index'))}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Skapa formulär</h1>
            <p className="text-muted-foreground mt-1">
              Skapa ett nytt multi-step formulär
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Formulärinställningar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => {
                    setData('title', e.target.value);
                    if (!data.slug) {
                      setData('slug', generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Hitta din nästa bil"
                  required
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  placeholder="hitta-din-nasta-bil"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  URL: /forms/{data.slug}
                </p>
                {errors.slug && (
                  <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Berätta för oss vad du söker..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="success_message">Succémeddelande</Label>
                <Input
                  id="success_message"
                  value={data.success_message}
                  onChange={(e) => setData('success_message', e.target.value)}
                  placeholder="Tack för ditt svar!"
                />
              </div>

              <div>
                <Label htmlFor="submit_button_text">Text på skicka-knapp</Label>
                <Input
                  id="submit_button_text"
                  value={data.submit_button_text}
                  onChange={(e) => setData('submit_button_text', e.target.value)}
                  placeholder="Skicka"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData('is_active', checked)}
                />
                <Label htmlFor="is_active">Aktivt formulär</Label>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Frågor ({data.questions.length})</CardTitle>
                <Button type="button" onClick={addQuestion} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Lägg till fråga
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Inga frågor ännu. Lägg till en fråga för att komma igång.
                </div>
              ) : (
                data.questions.map((question, qIndex) => (
                  <Card key={qIndex}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-semibold">Fråga {qIndex + 1}</h4>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Titel *</Label>
                        <Input
                          value={question.title}
                          onChange={(e) =>
                            updateQuestion(qIndex, 'title', e.target.value)
                          }
                          placeholder="Vad ska bilen användas till?"
                          required
                        />
                      </div>

                      <div>
                        <Label>Underrubrik</Label>
                        <Input
                          value={question.subtitle}
                          onChange={(e) =>
                            updateQuestion(qIndex, 'subtitle', e.target.value)
                          }
                          placeholder="Välj det som bäst beskriver din situation"
                        />
                      </div>

                      <div>
                        <Label>Typ *</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) =>
                            updateQuestion(qIndex, 'type', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiselect">Flerval</SelectItem>
                            <SelectItem value="single_select">Enkelval</SelectItem>
                            <SelectItem value="slider">Slider</SelectItem>
                            <SelectItem value="image_select">Bildval</SelectItem>
                            <SelectItem value="text">Textfält</SelectItem>
                            <SelectItem value="email">E-post</SelectItem>
                            <SelectItem value="phone">Telefon</SelectItem>
                            <SelectItem value="textarea">Textområde</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {question.type === 'slider' && (
                        <div className="grid grid-cols-5 gap-4">
                          <div>
                            <Label>Min</Label>
                            <Input
                              type="number"
                              value={question.config.min || 0}
                              onChange={(e) =>
                                updateQuestion(qIndex, 'config', {
                                  ...question.config,
                                  min: parseInt(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Max</Label>
                            <Input
                              type="number"
                              value={question.config.max || 100}
                              onChange={(e) =>
                                updateQuestion(qIndex, 'config', {
                                  ...question.config,
                                  max: parseInt(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Standard</Label>
                            <Input
                              type="number"
                              value={question.config.default || 0}
                              onChange={(e) =>
                                updateQuestion(qIndex, 'config', {
                                  ...question.config,
                                  default: parseInt(e.target.value),
                                })
                              }
                              placeholder="Startvärde"
                            />
                          </div>
                          <div>
                            <Label>Steg</Label>
                            <Input
                              type="number"
                              value={question.config.step || 1}
                              onChange={(e) =>
                                updateQuestion(qIndex, 'config', {
                                  ...question.config,
                                  step: parseInt(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Enhet</Label>
                            <Input
                              value={question.config.unit || ''}
                              onChange={(e) =>
                                updateQuestion(qIndex, 'config', {
                                  ...question.config,
                                  unit: e.target.value,
                                })
                              }
                              placeholder="mil, km"
                            />
                          </div>
                        </div>
                      )}

                      {['text', 'email', 'phone', 'textarea'].includes(question.type) && (
                        <div className="space-y-3">
                          <div>
                            <Label>Platshållare</Label>
                            <Input
                              value={question.config.placeholder || ''}
                              onChange={(e) =>
                                updateQuestion(qIndex, 'config', {
                                  ...question.config,
                                  placeholder: e.target.value,
                                })
                              }
                              placeholder="T.ex. 'Skriv ditt namn...'"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={question.config.validate || false}
                              onCheckedChange={(checked) =>
                                updateQuestion(qIndex, 'config', {
                                  ...question.config,
                                  validate: checked,
                                })
                              }
                            />
                            <Label>Aktivera validering</Label>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={question.is_required}
                          onCheckedChange={(checked) =>
                            updateQuestion(qIndex, 'is_required', checked)
                          }
                        />
                        <Label>Obligatorisk fråga</Label>
                      </div>

                      {/* Options */}
                      {['multiselect', 'single_select', 'image_select'].includes(question.type) && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Alternativ</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => addOption(qIndex)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Lägg till alternativ
                            </Button>
                          </div>

                          {question.options.map((option, oIndex) => (
                            <Card key={oIndex}>
                              <CardContent className="pt-4 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-3">
                                    <div>
                                      <Label>Label *</Label>
                                      <Input
                                        value={option.label}
                                        onChange={(e) =>
                                          updateOption(
                                            qIndex,
                                            oIndex,
                                            'label',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Pendling"
                                        required
                                      />
                                    </div>

                                    <div>
                                      <Label>Beskrivning</Label>
                                      <Input
                                        value={option.description}
                                        onChange={(e) =>
                                          updateOption(
                                            qIndex,
                                            oIndex,
                                            'description',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Till och från jobbet dagligen"
                                      />
                                    </div>

                                    <IconSelector
                                      value={option.icon}
                                      onChange={(value) =>
                                        updateOption(qIndex, oIndex, 'icon', value)
                                      }
                                    />

                                    {question.type === 'image_select' && (
                                      <div>
                                        <Label>Bild-URL</Label>
                                        <Input
                                          value={option.image_url}
                                          onChange={(e) =>
                                            updateOption(
                                              qIndex,
                                              oIndex,
                                              'image_url',
                                              e.target.value
                                            )
                                          }
                                          placeholder="https://example.com/image.jpg"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(qIndex, oIndex)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}

              {data.questions.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button type="button" onClick={addQuestion} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Lägg till fråga
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(route('admin.forms.index'))}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={processing || data.questions.length === 0}>
              {processing ? 'Sparar...' : 'Skapa formulär'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
