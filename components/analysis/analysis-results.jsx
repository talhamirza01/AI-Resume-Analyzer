"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Target, Briefcase, MessageCircleQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AtsScoreCircle } from "./ats-score-circle";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function ListSection({ title, items, icon: Icon, variant = "default" }) {
  if (!items?.length) return null;

  return (
    <motion.div variants={item}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-5 w-5 text-blue-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {items.map((text, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Badge variant={variant} className="mt-0.5 shrink-0">
                  {i + 1}
                </Badge>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function KeywordCloud({ title, keywords, variant }) {
  if (!keywords?.length) return null;

  return (
    <motion.div variants={item}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <Badge key={i} variant={variant}>
                {kw}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AnalysisResults({ analysis, showInterviewQuestions = true }) {
  if (!analysis) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex justify-center">
        <Card className="p-8">
          <AtsScoreCircle score={analysis.atsScore} />
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <ListSection title="Strengths" items={analysis.strengths} icon={CheckCircle2} variant="success" />
        <ListSection title="Weaknesses" items={analysis.weaknesses} icon={XCircle} variant="danger" />
        <KeywordCloud title="Missing Keywords" keywords={analysis.missingKeywords} variant="warning" />
        <KeywordCloud title="Matching Skills" keywords={analysis.matchingSkills} variant="success" />
        <ListSection title="Improvements" items={analysis.improvements} icon={Lightbulb} variant="secondary" />
        <ListSection title="Career Suggestions" items={analysis.careerSuggestions} icon={Briefcase} variant="default" />
        {showInterviewQuestions && (
          <div className="md:col-span-2">
            <ListSection
              title="Interview Questions"
              items={analysis.interviewQuestions}
              icon={MessageCircleQuestion}
              variant="secondary"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
